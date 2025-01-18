import { useReducer } from "react";
import { getFromLocalStorage } from "@actions/utils";
import { DEFAULT_TEXT_SETTINGS } from "@resources/constants";

function reducer(state, action) {
  switch (action.type) {
    case "setFocusMode":
      return { ...state, focusMode: action.payload };
    case "toggleFocusMode":
      return { ...state, focusMode: !state.focusMode };
    case "setHighlights":
      return { ...state, highlights: action.payload };
    case "toggleHighlights":
      return { ...state, highlights: !state.highlights };
    case "setColumnCount":
      return { ...state, columnCount: action.payload };
    case "setLineHeight":
      return { ...state, lineHeight: action.payload };
    case "setFontSize":
      return { ...state, fontSize: action.payload };
    case "setTextWidth":
      return { ...state, textWidth: action.payload };
    default:
      throw new Error();
  }
}

function useBookState() {
  const [state, dispatch] = useReducer(reducer, {
    fontSize: getFromLocalStorage(
      "Lute.fontSize",
      DEFAULT_TEXT_SETTINGS.fontSize
    ),
    lineHeight: getFromLocalStorage(
      "Lute.lineHeight",
      DEFAULT_TEXT_SETTINGS.lineHeight
    ),
    columnCount: getFromLocalStorage(
      "Lute.columnCount",
      DEFAULT_TEXT_SETTINGS.columnCount
    ),
    highlights: getFromLocalStorage(
      "Lute.highlights",
      DEFAULT_TEXT_SETTINGS.highlights
    ),
    focusMode: getFromLocalStorage(
      "Lute.focusMode",
      DEFAULT_TEXT_SETTINGS.focusMode
    ),
    textWidth: getFromLocalStorage(
      "Lute.textWidth",
      DEFAULT_TEXT_SETTINGS.textWidth
    ),
  });

  return [state, dispatch];
}

export default useBookState;
