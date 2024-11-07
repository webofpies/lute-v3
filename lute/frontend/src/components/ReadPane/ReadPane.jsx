import { lazy, Suspense, useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Divider, Title } from "@mantine/core";
import { useDisclosure, useMouse } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import ReadPaneHeader from "./ReadPaneHeader";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import TheText from "../TheText/TheText";
import styles from "./ReadPane.module.css";
import { UserSettingsContext } from "../../context/UserSettingsContext";
import { clamp, getPressedKeysAsString } from "../../misc/utils";
import { startHoverMode } from "../../lute";
import {
  moveCursor,
  incrementStatusForMarked,
  updateStatusForMarked,
  handleAddBookmark,
  handleCopy,
  handleEditPage,
  handleTranslate,
  goToNextTheme,
  toggleHighlight,
  toggleFocus,
} from "../../misc/keydown";

const LearnPane = lazy(() => import("./LearnPane"));
const Player = lazy(() => import("../Player/Player"));

export default function ReadPane() {
  const { id, page: pageNum } = useParams();
  const { settings } = useContext(UserSettingsContext);

  const [opened, { open, close }] = useDisclosure(false);
  // const [highlightsOn, setHighlightsOn] = useState(true);
  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });
  const [width, setWidth] = useState(50);
  const paneLeftRef = useRef();
  const paneRightRef = useRef();

  const { ref, x } = useMouse();

  function handleResize(e) {
    e.preventDefault();
    paneLeftRef.current.style.pointerEvents = "none";
    paneRightRef.current.style.pointerEvents = "none";

    const containerHeight = parseFloat(
      window.getComputedStyle(ref.current).getPropertyValue("width")
    );

    function resize(e) {
      const delta = x - e.clientX;
      const ratioInPct = (delta / containerHeight) * 100;
      const newWidth = width - ratioInPct;
      setWidth(clamp(newWidth, 5, 95));
    }

    ref.current.addEventListener("mousemove", resize);

    ref.current.addEventListener("mouseup", () => {
      ref.current.removeEventListener("mousemove", resize);
      paneLeftRef.current.style.pointerEvents = "unset";
      paneRightRef.current.style.pointerEvents = "unset";
    });
  }

  const { data: book } = useQuery(bookQuery(id));
  const { data: page } = useQuery(pageQuery(id, pageNum));

  useEffect(() => {
    nprogress.complete();
  }, [pageNum]);

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

  return (
    <>
      <DrawerMenu
        opened={opened}
        close={close}
        // onToggleHighlights={() => {
        //   setHighlightsOn((h) => !h);
        // }}
      />

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
          <div style={{ marginTop: "8rem" }}>
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
          onMouseDown={handleResize}
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

function setupKeydownEvents(e, settings) {
  if (document.querySelectorAll(".word").length === 0) {
    return; // Nothing to do.
  }

  const next = settings.rtl ? -1 : 1;
  const prev = -1 * next;

  // Map of shortcuts to lambdas:
  const map = {
    [settings.hotkey_StartHover]: () => startHoverMode(),
    [settings.hotkey_PrevWord]: () => moveCursor(".word", prev),
    [settings.hotkey_NextWord]: () => moveCursor(".word", next),
    [settings.hotkey_PrevUnknownWord]: () => moveCursor(".word.status0", prev),
    [settings.hotkey_NextUnknownWord]: () => moveCursor(".word.status0", next),
    [settings.hotkey_PrevSentence]: () => moveCursor(".sentencestart", prev),
    [settings.hotkey_NextSentence]: () => moveCursor(".sentencestart", next),
    [settings.hotkey_StatusUp]: () => incrementStatusForMarked(+1),
    [settings.hotkey_StatusDown]: () => incrementStatusForMarked(-1),
    [settings.hotkey_Bookmark]: () => handleAddBookmark(),
    [settings.hotkey_CopySentence]: () => handleCopy("sentence-id"),
    [settings.hotkey_CopyPara]: () => handleCopy("paragraph-id"),
    [settings.hotkey_CopyPage]: () => handleCopy(null),
    [settings.hotkey_EditPage]: () => handleEditPage(),
    [settings.hotkey_TranslateSentence]: () => handleTranslate("sentence-id"),
    [settings.hotkey_TranslatePara]: () => handleTranslate("paragraph-id"),
    [settings.hotkey_TranslatePage]: () => handleTranslate(null),
    [settings.hotkey_NextTheme]: () => goToNextTheme(),
    [settings.hotkey_ToggleHighlight]: () => toggleHighlight(),
    [settings.hotkey_ToggleFocus]: () => toggleFocus(),
    [settings.hotkey_Status1]: () => updateStatusForMarked(1),
    [settings.hotkey_Status2]: () => updateStatusForMarked(2),
    [settings.hotkey_Status3]: () => updateStatusForMarked(3),
    [settings.hotkey_Status4]: () => updateStatusForMarked(4),
    [settings.hotkey_Status5]: () => updateStatusForMarked(5),
    [settings.hotkey_StatusIgnore]: () => updateStatusForMarked(98),
    [settings.hotkey_StatusWellKnown]: () => updateStatusForMarked(99),
    [settings.hotkey_DeleteTerm]: () => updateStatusForMarked(0),
  };

  const key = getPressedKeysAsString(e);
  if (key in map) {
    // Override any existing event - e.g., if "up" arrow is in the map,
    // don't scroll screen.
    e.preventDefault();
    map[key]();
  }
}
