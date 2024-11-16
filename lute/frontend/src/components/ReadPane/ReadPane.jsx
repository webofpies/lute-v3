import { useContext, useReducer, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Divider, ScrollArea, Title } from "@mantine/core";
import { useDisclosure, useMouse } from "@mantine/hooks";
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
import {
  setFontSize,
  setLineHeight,
  setColumnCount,
  setHighlightsOn,
  setHighlightsOff,
} from "../../misc/textActions";
import { useInitialize } from "../../hooks/book";
import { bookQuery, pageQuery } from "../../queries/book";
import { clamp } from "../../misc/utils";

function reducer(state, action) {
  switch (action.type) {
    case "toggleFocus":
      return { ...state, focusMode: !state.focusMode };
    case "toggleHighlights":
      return { ...state, highlights: !state.highlights };
    case "setWidth":
      return { ...state, width: action.payload };
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

const initialState = {
  width: 50,
  focusMode: false,
  highlights: true,
  columnCount: 1,
  lineHeight: 1.25,
  fontSize: 1,
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
    theTextRef,
    handleResizeBegan,
    handleResizeDone,
    handleResizing,
  } = useInitialize(book, page, settings);

  const { ref: paneMainRef, x: mousePosition } = useMouse();

  const [drawerOpened, { open: drawerOpen, close: drawerClose }] =
    useDisclosure(false);
  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleToggleHighlights(checked) {
    dispatch({ type: "toggleHighlights" });
    checked ? setHighlightsOn(textItemRefs) : setHighlightsOff(textItemRefs);
  }

  function handleToggleFocusMode() {
    dispatch({ type: "toggleFocus" });
  }

  function handleSetColumnCount(count) {
    dispatch({ type: "setColumnCount", payload: count });
    setColumnCount(theTextRef, count);
  }

  function handleSetLineHeight(amount) {
    const clamped = clamp(amount, 1.25, 5);
    dispatch({ type: "setLineHeight", payload: clamped });
    setLineHeight(theTextRef, clamped);
  }

  function handleSetFontSize(size) {
    const clamped = clamp(size, 0.5, 3);
    dispatch({ type: "setFontSize", payload: clamped });
    setFontSize(textItemRefs, clamped);
  }

  function handleSetWidth(width) {
    const clamped = clamp(width, 5, 95);
    dispatch({ type: "setWidth", payload: clamped });
  }

  function handleResize(e, currentSize, direction, onSetSize, onResizing) {
    e.preventDefault();

    let newSize;

    const containerSize = parseFloat(
      window
        .getComputedStyle(paneMainRef.current)
        .getPropertyValue(`${direction === "horizontal" ? "width" : "height"}`)
    );

    function handleMouseMove(e) {
      const point = direction === "horizontal" ? e.clientX : e.clientY;

      const delta = mousePosition - point;
      const ratio = (delta / containerSize) * 100;
      newSize = currentSize - ratio;

      onResizing(newSize);
    }

    function handleMouseUp() {
      paneMainRef.current.removeEventListener("mousemove", handleMouseMove);
      if (!newSize) return; //do not set state if hasn't been resizing

      onSetSize(newSize);
    }

    paneMainRef.current.addEventListener("mousemove", handleMouseMove);
    paneMainRef.current.addEventListener("mouseup", handleMouseUp, {
      once: true,
    });
  }

  return (
    <>
      <DrawerMenu opened={drawerOpened} close={drawerClose} />
      <Toolbar
        width={state.width}
        fontSize={state.fontSize}
        lineHeight={state.lineHeight}
        onSetColumnCount={handleSetColumnCount}
        onSetLineHeight={handleSetLineHeight}
        onSetFontSize={handleSetFontSize}
        onSetWidth={handleSetWidth}
      />
      <ContextMenu ref={ctxMenuContainerRef} />

      <div ref={paneMainRef} style={{ height: "100%" }}>
        <div
          ref={paneLeftRef}
          className={`${styles.paneLeft}`}
          style={{ width: `${state.focusMode ? 100 : state.width}%` }}>
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
              style={{ left: `${state.width}%` }}
              styles={{ root: { width: "8px", border: "none" } }}
              className={`${styles.vdivider}`}
              orientation="vertical"
              onMouseDown={(e) => {
                handleResize(
                  e,
                  state.width,
                  "horizontal",
                  handleSetWidth,
                  handleResizing
                );
                handleResizeBegan();
              }}
              onMouseUp={handleResizeDone}
              onDoubleClick={() =>
                state.width > 85 ? handleSetWidth(50) : handleSetWidth(95)
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

export default ReadPane;
