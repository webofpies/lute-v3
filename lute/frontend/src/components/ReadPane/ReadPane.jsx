import { useContext, useReducer, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ScrollArea, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import LearnPane from "./LearnPane";
import ReadPaneHeader from "./ReadPaneHeader";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import Toolbar from "../Toolbar/Toolbar";
import ContextMenu from "../ContextMenu/ContextMenu";
import Player from "../Player/Player";
import TheText from "../TheText/TheText";
import styles from "./ReadPane.module.css";
import { UserSettingsContext } from "../../context/UserSettingsContext";
import { useInitialize } from "../../hooks/book";
import { bookQuery, pageQuery } from "../../queries/book";
import { getFromLocalStorage, paneResizeStorage } from "../../misc/utils";
import { handleClickOutside } from "../../lute";

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

function ReadPane() {
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
          className={`${styles.paneLeft}`}>
          <div style={{ position: "relative" }}>
            <ReadPaneHeader
              book={book}
              drawerOpen={drawerOpen}
              state={state}
              dispatch={dispatch}
            />
            {book.audio.name && <Player book={book} />}
            <Toolbar state={state} dispatch={dispatch} />
          </div>
          <ScrollArea
            type="scroll"
            ref={refs.contextMenuArea}
            flex={1}
            onMouseDown={(e) => {
              const res = handleClickOutside(e);
              if (!res) return;
              setActiveTerm(res);
            }}>
            <div
              className={`${styles.textContainer}`}
              style={{
                width: `${state.focusMode ? 50 : 100}%`,
                marginInline: state.focusMode && "auto",
              }}>
              {Number(pageNum) === 1 && (
                <Title
                  className={styles.title}
                  dir={book.isRightToLeft ? "rtl" : ""}>
                  {book.title}
                </Title>
              )}
              <TheText
                pageData={page}
                onSetActiveTerm={setActiveTerm}
                refs={refs}
              />
            </div>
          </ScrollArea>
        </Panel>

        {!state.focusMode && (
          <>
            <PanelResizeHandle
              hitAreaMargins={{ coarse: 10, fine: 10 }}
              className={styles.resizeHandle}
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
                <LearnPane book={book} termData={activeTerm} />
              )}
            </Panel>
          </>
        )}
      </PanelGroup>
    </>
  );
}

export default ReadPane;
