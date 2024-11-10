import { lazy, Suspense, useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Divider, Title } from "@mantine/core";
import { useDisclosure, useMouse } from "@mantine/hooks";
import ReadPaneHeader from "./ReadPaneHeader";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import Toolbar from "../Toolbar/Toolbar";
import TheText from "../TheText/TheText";
import styles from "./ReadPane.module.css";
import { UserSettingsContext } from "../../context/UserSettingsContext";
import { clamp, getPressedKeysAsString } from "../../misc/utils";
import { actions } from "../../misc/actionsMap";

import ContextMenu from "../ContextMenu/ContextMenu";

const LearnPane = lazy(() => import("./LearnPane"));
const Player = lazy(() => import("../Player/Player"));

function ReadPane() {
  const { id, page: pageNum } = useParams();
  const { settings } = useContext(UserSettingsContext);

  const { ref, x } = useMouse();
  const paneLeftRef = useRef();
  const paneRightRef = useRef();
  const textContainerRef = useRef();

  const [opened, { open, close }] = useDisclosure(false);
  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });
  const [width, setWidth] = useState(50);

  const { data: book } = useQuery(bookQuery(id));
  const { data: page } = useQuery(pageQuery(id, pageNum));

  useInitialize(book, settings);

  return (
    <>
      <DrawerMenu opened={opened} close={close} />
      <Toolbar />
      <ContextMenu ref={textContainerRef} />

      <div ref={ref}>
        <div
          ref={paneLeftRef}
          className={styles.paneLeft}
          style={{ width: `${width}%` }}>
          <ReadPaneHeader
            book={book}
            open={open}
            pageNum={pageNum}
            width={width}
          />
          <div ref={textContainerRef} className={styles.textContainer}>
            {book.audio.name && (
              <Suspense>
                <Player source={{ ...book.audio, id: book.id }} />
              </Suspense>
            )}
            {pageNum === 1 && (
              <Title
                style={{ overflowWrap: "break-word" }}
                size="xl"
                mb="lg"
                dir={book.isRightToLeft ? "rtl" : ""}>
                {book.title}
              </Title>
            )}
            <TheText pageData={page} onSetActiveTerm={setActiveTerm} />
          </div>
        </div>

        <Divider
          style={{ left: `${width}%` }}
          styles={{ root: { width: "6px", border: "none" } }}
          className={styles.vdivider}
          orientation="vertical"
          onMouseDown={(e) =>
            handleResize(
              e,
              width,
              setWidth,
              ref.current,
              paneLeftRef.current,
              paneRightRef.current,
              x
            )
          }
        />

        <div
          ref={paneRightRef}
          className={styles.paneRight}
          style={{ width: `${100 - width}%` }}>
          {activeTerm.data && (
            <Suspense>
              <LearnPane book={book} termData={activeTerm} />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
}

export function loader(queryClient) {
  return async ({ params }) => {
    const bq = bookQuery(params.id);

    const bookData =
      queryClient.getQueryData(bq.queryKey) ??
      (await queryClient.fetchQuery(bq));

    const pq = pageQuery(params.id, params.page);

    const pageData =
      queryClient.getQueryData(pq.queryKey) ??
      (await queryClient.fetchQuery(pq));

    return { bookData, pageData };
  };
}

function bookQuery(id) {
  return {
    queryKey: ["bookData", id],
    queryFn: async () => {
      const bookResponse = await fetch(`http://localhost:5001/read/${id}/info`);
      const book = await bookResponse.json();
      return book;
    },
    refetchOnWindowFocus: false,
  };
}

function pageQuery(bookId, pageNum) {
  return {
    queryKey: ["pageData", bookId, pageNum],
    queryFn: async () => {
      const pageResponse = await fetch(
        `http://localhost:5001/read/${bookId}/${pageNum}/pageinfo`
      );
      const pageData = await pageResponse.json();
      return pageData;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  };
}

function useInitialize(book, settings) {
  useEffect(() => {
    const title = document.title;
    document.title = `Reading "${book.title}"`;

    return () => {
      document.title = title;
    };
  }, [book.title]);

  useEffect(() => {
    function handleKeydown(e) {
      setupKeydownEvents(e, {
        ...settings,
        rtl: book.isRightToLeft,
        bookId: book.id,
        pageNum: book.currentPage,
        sentenceDicts: book.dictionaries.sentence,
      });
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [
    book.currentPage,
    book.dictionaries.sentence,
    book.id,
    book.isRightToLeft,
    settings,
  ]);
}

function handleResize(
  e,
  currentWidth,
  setWidth,
  paneMain,
  paneLeft,
  paneRight,
  x
) {
  e.preventDefault();
  paneLeft.style.pointerEvents = "none";
  paneRight.style.pointerEvents = "none";

  const containerHeight = parseFloat(
    window.getComputedStyle(paneMain).getPropertyValue("width")
  );

  function resize(e) {
    const delta = x - e.clientX;
    const ratioInPct = (delta / containerHeight) * 100;
    const newWidth = currentWidth - ratioInPct;
    setWidth(clamp(newWidth, 5, 95));
  }

  paneMain.addEventListener("mousemove", resize);

  paneMain.addEventListener("mouseup", () => {
    paneMain.removeEventListener("mousemove", resize);
    paneLeft.style.pointerEvents = "unset";
    paneRight.style.pointerEvents = "unset";
  });
}

function setupKeydownEvents(e, settings) {
  if (document.querySelectorAll(".word").length === 0) {
    return; // Nothing to do.
  }

  const next = settings.rtl ? -1 : 1;
  const prev = -1 * next;

  // Map of shortcuts to lambdas:
  const map = {
    [settings.hotkey_StartHover]: actions.hotkey_StartHover,
    [settings.hotkey_PrevWord]: () => actions.hotkey_PrevWord(".word", prev),
    [settings.hotkey_NextWord]: () => actions.hotkey_NextWord(".word", next),
    [settings.hotkey_PrevUnknownWord]: () =>
      actions.hotkey_PrevUnknownWord(".word.status0", prev),
    [settings.hotkey_NextUnknownWord]: () =>
      actions.hotkey_NextUnknownWord(".word.status0", next),
    [settings.hotkey_PrevSentence]: () =>
      actions.hotkey_PrevSentence(".sentencestart", prev),
    [settings.hotkey_NextSentence]: () =>
      actions.hotkey_NextSentence(".sentencestart", next),
    [settings.hotkey_StatusUp]: () => actions.hotkey_StatusUp(+1),
    [settings.hotkey_StatusDown]: () => actions.hotkey_StatusDown(-1),
    [settings.hotkey_Bookmark]: () =>
      actions.hotkey_Bookmark(settings.bookId, settings.pageNum),
    [settings.hotkey_CopySentence]: () =>
      actions.hotkey_CopySentence("sentence-id"),
    [settings.hotkey_CopyPara]: () => actions.hotkey_CopyPara("paragraph-id"),
    [settings.hotkey_CopyPage]: () => actions.hotkey_CopyPage(null),
    [settings.hotkey_EditPage]: () =>
      actions.hotkey_EditPage(settings.bookId, settings.pageNum),
    [settings.hotkey_TranslateSentence]: () =>
      actions.hotkey_TranslateSentence("sentence-id"),
    [settings.hotkey_TranslatePara]: () =>
      actions.hotkey_TranslatePara("paragraph-id"),
    [settings.hotkey_TranslatePage]: () => actions.hotkey_TranslatePage(null),
    [settings.hotkey_NextTheme]: actions.hotkey_NextTheme,
    [settings.hotkey_ToggleHighlight]: actions.hotkey_ToggleHighlight,
    [settings.hotkey_ToggleFocus]: actions.hotkey_ToggleFocus,
    [settings.hotkey_Status1]: () => actions.hotkey_Status1(1),
    [settings.hotkey_Status2]: () => actions.hotkey_Status2(2),
    [settings.hotkey_Status3]: () => actions.hotkey_Status3(3),
    [settings.hotkey_Status4]: () => actions.hotkey_Status4(4),
    [settings.hotkey_Status5]: () => actions.hotkey_Status5(5),
    [settings.hotkey_StatusIgnore]: () => actions.hotkey_StatusIgnore(98),
    [settings.hotkey_StatusWellKnown]: () => actions.hotkey_StatusWellKnown(99),
    [settings.hotkey_DeleteTerm]: () => actions.hotkey_DeleteTerm(0),
  };

  const key = getPressedKeysAsString(e);
  if (key in map) {
    // Override any existing event - e.g., if "up" arrow is in the map,
    // don't scroll screen.
    e.preventDefault();
    map[key]();
  }
}

export default ReadPane;
