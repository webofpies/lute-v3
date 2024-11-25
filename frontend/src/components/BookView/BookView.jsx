import { useContext, useReducer, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReadPane from "../ReadPane/ReadPane";
import TranslationPane from "../TranslationPane/TranslationPane";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import ContextMenu from "../ContextMenu/ContextMenu";
import { UserSettingsContext } from "../../context/UserSettingsContext";
import { useInitialize } from "../../hooks/book";
import { bookQuery, pageQuery } from "../../queries/book";
import { getFromLocalStorage, paneResizeStorage } from "../../misc/utils";
import classes from "./BookView.module.css";

function reducer(state, action) {
  switch (action.type) {
    case "setFocusMode":
      return { ...state, focusMode: action.payload };
    case "setHighlights":
      return { ...state, highlights: action.payload };
    case "setColumnCount":
      return { ...state, columnCount: action.payload };
    case "setLineHeight":
      return { ...state, lineHeight: action.payload };
    case "setFontSize":
      return { ...state, fontSize: action.payload };
    default:
      throw new Error();
  }
}

function BookView() {
  const { id, page: pageNum } = useParams();
  const { settings } = useContext(UserSettingsContext);

  const { data: book } = useQuery(bookQuery(id));
  const { data: page } = useQuery(pageQuery(id, pageNum));

  const [state, dispatch] = useReducer(reducer, {
    fontSize: getFromLocalStorage("Lute.fontSize", 1),
    lineHeight: getFromLocalStorage("Lute.lineHeight", 1),
    columnCount: getFromLocalStorage("Lute.columnCount", 1),
    highlights: getFromLocalStorage("Lute.highlights", true),
    focusMode: getFromLocalStorage("Lute.focusMode", false),
  });

  const refs = useInitialize(book, page, state, settings);

  const [drawerOpened, { open: drawerOpen, close: drawerClose }] =
    useDisclosure(false);
  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });

  return (
    <>
      <DrawerMenu opened={drawerOpened} close={drawerClose} />
      <ContextMenu ref={refs.contextMenuArea} />
      <PanelGroup
        autoSaveId="Lute.horizontalSize"
        direction="horizontal"
        storage={paneResizeStorage}>
        <Panel
          order={1}
          defaultSize={50}
          minSize={30}
          className={`${classes.paneLeft}`}>
          <ReadPane
            book={book}
            page={page}
            refs={refs}
            state={state}
            dispatch={dispatch}
            onSetActiveTerm={setActiveTerm}
            onDrawerOpen={drawerOpen}
          />
        </Panel>

        {!state.focusMode && (
          <>
            <PanelResizeHandle
              hitAreaMargins={{ coarse: 10, fine: 10 }}
              className={classes.resizeHandle}
              onDoubleClick={() => {
                const panel = refs.paneRight.current;
                if (panel) {
                  panel.getSize() < 15 ? panel.resize(50) : panel.resize(5);
                }
              }}
            />

            <Panel
              ref={refs.paneRight}
              defaultSize={50}
              order={2}
              collapsible={true}
              minSize={5}>
              {activeTerm.data && (
                <TranslationPane book={book} termData={activeTerm} />
              )}
            </Panel>
          </>
        )}
      </PanelGroup>
    </>
  );
}

export default BookView;
