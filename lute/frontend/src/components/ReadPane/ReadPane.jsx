import {
  createRef,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useParams } from "react-router-dom";
import { Divider, ScrollArea, Title } from "@mantine/core";
import { useDisclosure, useMouse } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import LearnPane from "./LearnPane";
import ReadPaneHeader from "./ReadPaneHeader";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import Toolbar from "../Toolbar/Toolbar";
import ContextMenu from "../ContextMenu/ContextMenu";
import Player from "../Player/Player";
import TheText from "../TheText/TheText";
import ReadFooter from "./ReadFooter";
import styles from "./ReadPane.module.css";
import { UserSettingsContext } from "../../context/UserSettingsContext";
import { actions } from "../../misc/actionsMap";
import {
  handleResizeHorizontal,
  toggleHighlights,
} from "../../misc/textActions";
import { getPressedKeysAsString } from "../../misc/utils";

function reducer(state, action) {
  switch (action.type) {
    case "setWidth":
      return { ...state, width: action.payload };
    case "adjustWidth":
      return { ...state, width: state.width * action.payload };
    case "toggleFocus":
      return { ...state, focusMode: !state.focusMode };
    case "toggleHighlights":
      return { ...state, highlights: !state.highlights };
    default:
      throw new Error();
  }
}

const initialState = {
  width: 50,
  focusMode: false,
  highlights: true,
};

function ReadPane() {
  const { id, page: pageNum } = useParams();
  const { settings } = useContext(UserSettingsContext);

  const { data: book } = useQuery(bookQuery(id));
  const { data: page } = useQuery(pageQuery(id, pageNum));

  const {
    textItemRefs,
    paneLeftRef,
    paneRightRef,
    dividerRef,
    ctxMenuContainerRef,
  } = useInitialize(book, page, settings);

  const { ref, x } = useMouse();

  const [drawerOpened, { open: drawerOpen, close: drawerClose }] =
    useDisclosure(false);
  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleToggleHighlights(checked) {
    dispatch({ type: "toggleHighlights" });
    toggleHighlights(textItemRefs, checked);
  }

  return (
    <>
      <DrawerMenu opened={drawerOpened} close={drawerClose} />
      <Toolbar dispatch={dispatch} />
      <ContextMenu ref={ctxMenuContainerRef} />

      <div ref={ref} style={{ height: "100%" }}>
        <div
          ref={paneLeftRef}
          className={`${styles.paneLeft}`}
          style={{
            width: `${state.focusMode ? 100 : state.width}%`,
          }}>
          <ReadPaneHeader
            book={book}
            drawerOpen={drawerOpen}
            pageNum={Number(pageNum)}
            onToggleHighlights={handleToggleHighlights}
            state={state}
            dispatch={dispatch}
          />
          {book.audio.name && <Player book={book} />}

          <ScrollArea ref={ctxMenuContainerRef} flex={1}>
            <div
              className={`${styles.textContainer}`}
              style={{
                width: `${state.focusMode ? state.width : 100}%`,
                marginInline: state.focusMode && "auto",
              }}>
              {Number(pageNum) === 1 && (
                <Title
                  style={{ overflowWrap: "break-word" }}
                  size="xl"
                  mb="lg"
                  dir={book.isRightToLeft ? "rtl" : ""}>
                  {book.title}
                </Title>
              )}
              <TheText
                pageData={page}
                onSetActiveTerm={setActiveTerm}
                textItemRefs={textItemRefs}
              />
            </div>
          </ScrollArea>
          <ReadFooter />
        </div>

        {!state.focusMode && (
          <>
            <Divider
              ref={dividerRef}
              style={{ left: `${state.width}%` }}
              styles={{ root: { width: "8px", border: "none" } }}
              className={`${styles.vdivider}`}
              orientation="vertical"
              onMouseDown={(e) =>
                handleResizeHorizontal(
                  e,
                  state.width,
                  dispatch,
                  ref.current,
                  paneLeftRef.current,
                  paneRightRef.current,
                  dividerRef.current,
                  x
                )
              }
            />

            <div
              ref={paneRightRef}
              className={`${styles.paneRight}`}
              style={{ width: `${100 - state.width}%` }}>
              {activeTerm.data && (
                <LearnPane book={book} termData={activeTerm} />
              )}
            </div>
          </>
        )}
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

function useInitialize(book, page, settings) {
  const navigation = useNavigation();

  const paneLeftRef = useRef();
  const paneRightRef = useRef();
  const dividerRef = useRef();
  const ctxMenuContainerRef = useRef();

  const textItemRefs = useMemo(() => {
    const refs = {};
    page.forEach((para) =>
      para.forEach((sentence) =>
        sentence.forEach((item) => {
          if (item.isWord) refs[item.id] = createRef(null);
        })
      )
    );
    return refs;
  }, [page]);

  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  });

  useEffect(() => {
    const title = document.title;
    document.title = `Reading "${book.title}"`;

    return () => {
      document.title = title;
    };
  }, [book.title]);

  useEffect(() => {
    function handleKeydown(e) {
      setupKeydownEvents(e, actions, {
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

  return {
    textItemRefs,
    paneLeftRef,
    paneRightRef,
    dividerRef,
    ctxMenuContainerRef,
  };
}

function setupKeydownEvents(e, actions, settings) {
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
    [settings.hotkey_Status1]: () => actions.hotkey_Status1(1),
    [settings.hotkey_Status2]: () => actions.hotkey_Status2(2),
    [settings.hotkey_Status3]: () => actions.hotkey_Status3(3),
    [settings.hotkey_Status4]: () => actions.hotkey_Status4(4),
    [settings.hotkey_Status5]: () => actions.hotkey_Status5(5),
    [settings.hotkey_StatusIgnore]: () => actions.hotkey_StatusIgnore(98),
    [settings.hotkey_StatusWellKnown]: () => actions.hotkey_StatusWellKnown(99),
    [settings.hotkey_DeleteTerm]: () => actions.hotkey_DeleteTerm(0),

    [settings.hotkey_ToggleHighlight]: actions.hotkey_ToggleHighlight,
    [settings.hotkey_ToggleFocus]: actions.hotkey_ToggleFocus,
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
