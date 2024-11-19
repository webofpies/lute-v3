import { createRef, useEffect, useMemo } from "react";
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

function useInitialize(book, page, state, settings) {
  const textItemRefs = useMemo(() => {
    const res = {};
    page.forEach((para) =>
      para.forEach((sentence) =>
        sentence.forEach((item) => {
          res[item.order] = createRef(null);
        })
      )
    );
    return res;
  }, [page]);

  const refs = useMemo(
    () => ({
      paneRight: createRef(null),
      theText: createRef(null),
      contextMenuArea: createRef(null),
      textItems: textItemRefs,
    }),
    [textItemRefs]
  );

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
    setFontSize(refs.textItems, state.fontSize);
    setLineHeight(refs.textItems, state.lineHeight);
    setColumnCount(refs.theText, state.columnCount);
    state.highlights
      ? setHighlightsOn(refs.textItems)
      : setHighlightsOff(refs.textItems);
  }, [
    state.columnCount,
    state.fontSize,
    state.highlights,
    state.lineHeight,
    refs.textItems,
    refs.theText,
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

  return refs;
}

export { useInitialize };
