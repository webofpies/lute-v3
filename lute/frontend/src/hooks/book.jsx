import { createRef, useEffect, useMemo, useRef } from "react";
import { useNavigation } from "react-router-dom";
import {
  setColumnCount,
  setFontSize,
  setHighlightsOff,
  setHighlightsOn,
  setLineHeight,
  setupKeydownEvents,
} from "../misc/textActions";
import { actions } from "../misc/actionsMap";
import { nprogress } from "@mantine/nprogress";
import { clamp } from "../misc/utils";
import { useMouse } from "@mantine/hooks";

function useInitialize(book, page, state, dispatch, settings) {
  const paneLeftRef = useRef();
  const paneRightRef = useRef();
  const dividerRef = useRef();
  const ctxMenuContainerRef = useRef();
  const theTextRef = useRef();
  const { ref: paneMainRef, x: mousePosition } = useMouse();

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

  function handleToggleHighlights(checked) {
    dispatch({ type: "setHighlights", payload: checked });
    localStorage.setItem("Lute.highlights", JSON.stringify(checked));
  }

  function handleToggleFocusMode(checked) {
    dispatch({ type: "setFocusMode", payload: checked });
    localStorage.setItem("Lute.focusMode", JSON.stringify(checked));
  }

  function handleSetColumnCount(count) {
    dispatch({ type: "setColumnCount", payload: count });
    localStorage.setItem("Lute.columnCount", JSON.stringify(count));
  }

  function handleSetLineHeight(amount) {
    const clamped = clamp(amount, 0, 15);
    dispatch({ type: "setLineHeight", payload: clamped });
    localStorage.setItem("Lute.lineHeight", JSON.stringify(clamped));
  }

  function handleSetFontSize(size) {
    const clamped = clamp(size, 0.5, 3);
    const rounded = Number(clamped.toFixed(2));
    dispatch({ type: "setFontSize", payload: rounded });
    localStorage.setItem("Lute.fontSize", JSON.stringify(rounded));
  }

  function handleSetWidth(width) {
    const clamped = clamp(width, 5, 95);
    const rounded = Number(clamped.toFixed(3));
    dispatch({ type: "setWidth", payload: rounded });
    localStorage.setItem("Lute.paneWidth", JSON.stringify(rounded));
  }

  function handleResizeBegan() {
    paneLeftRef.current.style.pointerEvents = "none";
    paneRightRef.current.style.pointerEvents = "none";
    dividerRef.current.style.background = `linear-gradient(
                                          90deg,
                                          rgba(0, 0, 0, 0) 25%,
                                          var(--mantine-color-blue-filled) 25%,
                                          var(--mantine-color-blue-filled) 75%,
                                          rgba(0, 0, 0, 0) 75%
                                        )`;
  }

  function handleResizeDone() {
    paneLeftRef.current.style.pointerEvents = "unset";
    paneRightRef.current.style.pointerEvents = "unset";
    dividerRef.current.style.removeProperty("background");
  }

  function handleResizing(width) {
    const clamped = clamp(width, 5, 95);
    paneLeftRef.current.style.width = `${clamped}%`;
    dividerRef.current.style.left = `${clamped}%`;
    paneRightRef.current.style.width = `${100 - clamped}%`;
  }

  const textItemRefs = useMemo(() => {
    const refs = {};
    page.forEach((para) =>
      para.forEach((sentence) =>
        sentence.forEach((item) => {
          refs[item.order] = createRef(null);
        })
      )
    );
    return refs;
  }, [page]);

  const navigation = useNavigation();
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
    setFontSize(textItemRefs, state.fontSize);
    setLineHeight(textItemRefs, state.lineHeight);
    setColumnCount(theTextRef, state.columnCount);
    state.highlights
      ? setHighlightsOn(textItemRefs)
      : setHighlightsOff(textItemRefs);
  }, [
    state.columnCount,
    state.fontSize,
    state.highlights,
    state.lineHeight,
    textItemRefs,
    theTextRef,
  ]);

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
  };
}

export { useInitialize };
