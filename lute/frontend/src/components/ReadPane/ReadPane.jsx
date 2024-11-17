import { useContext, useReducer, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Divider, ScrollArea, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
import { useInitialize } from "../../hooks/book";
import { bookQuery, pageQuery } from "../../queries/book";
import { getFromLocalStorage } from "../../misc/utils";
import { handleClickOutside } from "../../lute";

function reducer(state, action) {
  switch (action.type) {
    case "setFocusMode":
      return { ...state, focusMode: action.payload };
    case "setHighlights":
      return { ...state, highlights: action.payload };
    case "setWidth":
      return { ...state, paneWidth: action.payload };
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
    paneWidth: getFromLocalStorage("Lute.paneWidth", 50),
    highlights: getFromLocalStorage("Lute.highlights", true),
    focusMode: getFromLocalStorage("Lute.focusMode", false),
  });

  const {
    textItemRefs,
    paneMainRef,
    paneLeftRef,
    paneRightRef,
    dividerRef,
    ctxMenuContainerRef,
    theTextRef,
    handleResize,
    handleToggleHighlights,
    handleToggleFocusMode,
    handleSetColumnCount,
    handleSetLineHeight,
    handleSetFontSize,
    handleSetWidth,
    handleResizeBegan,
    handleResizeDone,
    handleResizing,
  } = useInitialize(book, page, state, dispatch, settings);

  const [drawerOpened, { open: drawerOpen, close: drawerClose }] =
    useDisclosure(false);
  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });

  return (
    <>
      <DrawerMenu opened={drawerOpened} close={drawerClose} />
      <ContextMenu ref={ctxMenuContainerRef} />

      <div ref={paneMainRef} style={{ height: "100%" }}>
        <div
          ref={paneLeftRef}
          className={`${styles.paneLeft}`}
          style={{ width: `${state.focusMode ? 100 : state.paneWidth}%` }}>
          <div style={{ position: "relative" }}>
            <ReadPaneHeader
              book={book}
              drawerOpen={drawerOpen}
              pageNum={Number(pageNum)}
              focusMode={state.focusMode}
              highlights={state.highlights}
              onToggleFocusMode={handleToggleFocusMode}
              onToggleHighlights={handleToggleHighlights}
            />
            {book.audio.name && <Player book={book} />}
            <Toolbar
              width={state.paneWidth}
              fontSize={state.fontSize}
              lineHeight={state.lineHeight}
              onSetColumnCount={handleSetColumnCount}
              onSetLineHeight={handleSetLineHeight}
              onSetFontSize={handleSetFontSize}
              onSetWidth={handleSetWidth}
            />
          </div>

          <ScrollArea
            ref={ctxMenuContainerRef}
            flex={1}
            onMouseDown={(e) => {
              const res = handleClickOutside(e);
              if (!res) return;
              setActiveTerm(res);
            }}>
            <div
              className={`${styles.textContainer}`}
              style={{
                width: `${state.focusMode ? state.paneWidth : 100}%`,
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
                theTextRef={theTextRef}
              />
            </div>
          </ScrollArea>
          <ReadFooter />
        </div>

        {!state.focusMode && (
          <>
            <Divider
              ref={dividerRef}
              style={{ left: `${state.paneWidth}%` }}
              styles={{ root: { width: "8px", border: "none" } }}
              className={`${styles.vdivider}`}
              orientation="vertical"
              onMouseDown={(e) => {
                handleResize(
                  e,
                  state.paneWidth,
                  "horizontal",
                  handleSetWidth,
                  handleResizing
                );
                handleResizeBegan();
              }}
              onMouseUp={handleResizeDone}
              onDoubleClick={() =>
                state.paneWidth > 85 ? handleSetWidth(50) : handleSetWidth(95)
              }
            />

            <div
              ref={paneRightRef}
              className={`${styles.paneRight}`}
              style={{ width: `${100 - state.paneWidth}%` }}>
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

export default ReadPane;
