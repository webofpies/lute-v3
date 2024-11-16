import { createRef, useEffect, useMemo, useRef } from "react";
import { useNavigation } from "react-router-dom";
import { setupKeydownEvents } from "../misc/textActions";
import { actions } from "../misc/actionsMap";
import { nprogress } from "@mantine/nprogress";
import { clamp } from "../misc/utils";

function useInitialize(book, page, settings) {
  const navigation = useNavigation();

  const paneLeftRef = useRef();
  const paneRightRef = useRef();
  const dividerRef = useRef();
  const ctxMenuContainerRef = useRef();
  const theTextRef = useRef();

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
    theTextRef,
    handleResizeBegan,
    handleResizeDone,
    handleResizing,
  };
}

export { useInitialize };
