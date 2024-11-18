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

function useInitialize(book, page, state, dispatch, settings) {
  const paneLeftRef = useRef();
  const paneRightRef = useRef();
  const dividerRef = useRef();
  const ctxMenuContainerRef = useRef();
  const theTextRef = useRef();
  const termFormRef = useRef();

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
    const rounded = Number(size.toFixed(2));
    const clamped = clamp(rounded, 0.5, 3);
    dispatch({ type: "setFontSize", payload: clamped });
    localStorage.setItem("Lute.fontSize", JSON.stringify(clamped));
  }

  function handleSetWidth(width) {
    const rounded = Number(width.toFixed(3));
    const clamped = clamp(rounded, 5, 95);
    dispatch({ type: "setWidth", payload: clamped });
    localStorage.setItem("Lute.paneWidth", JSON.stringify(clamped));
  }

  function handleSetHeight(height) {
    const rounded = Number(height.toFixed(3));
    const clamped = clamp(rounded, 5, 95);
    dispatch({ type: "setHeight", payload: clamped });
    localStorage.setItem("Lute.paneHeight", JSON.stringify(clamped));
  }

  function handleXResizing(size) {
    const rounded = Number(size.toFixed(3));
    const clamped = clamp(rounded, 5, 95);
    paneLeftRef.current.style.width = `${clamped}%`;
    dividerRef.current.style.left = `${clamped}%`;
    paneRightRef.current.style.width = `${100 - clamped}%`;
  }

  function handleYResizing(size) {
    const rounded = Number(size.toFixed(3));
    const clamped = clamp(rounded, 5, 95);
    termFormRef.current.style.height = `${clamped}%`;
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
    paneLeftRef,
    paneRightRef,
    dividerRef,
    ctxMenuContainerRef,
    theTextRef,
    termFormRef,
    handleToggleHighlights,
    handleToggleFocusMode,
    handleSetColumnCount,
    handleSetLineHeight,
    handleSetFontSize,
    handleSetWidth,
    handleSetHeight,
    handleXResizing,
    handleYResizing,
  };
}

export { useInitialize };
