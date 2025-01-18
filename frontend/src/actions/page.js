import { clamp, getFromLocalStorage } from "./utils";

function handleSetHighlights(checked, dispatch) {
  dispatch({ type: "setHighlights", payload: checked });
  localStorage.setItem("Lute.highlights", JSON.stringify(checked));
}

function handleToggleHighlights(dispatch) {
  dispatch({ type: "toggleHighlights" });
  const state = getFromLocalStorage("Lute.highlights", false);
  localStorage.setItem("Lute.highlights", JSON.stringify(!state));
}

function handleSetFocusMode(checked, dispatch) {
  dispatch({ type: "setFocusMode", payload: checked });
  localStorage.setItem("Lute.focusMode", JSON.stringify(checked));
}

function handleToggleFocusMode(dispatch) {
  dispatch({ type: "toggleFocusMode" });
  const state = getFromLocalStorage("Lute.focusMode", false);
  localStorage.setItem("Lute.focusMode", JSON.stringify(!state));
}

function handleSetColumnCount(count, dispatch) {
  dispatch({ type: "setColumnCount", payload: count });
  localStorage.setItem("Lute.columnCount", JSON.stringify(count));
}

function handleSetLineHeight(amount, dispatch) {
  const clamped = clamp(amount, 0, 15);
  dispatch({ type: "setLineHeight", payload: clamped });
  localStorage.setItem("Lute.lineHeight", JSON.stringify(clamped));
}

function handleSetFontSize(size, dispatch) {
  const rounded = Number(size.toFixed(2));
  const clamped = clamp(rounded, 0.5, 3);
  dispatch({ type: "setFontSize", payload: clamped });
  localStorage.setItem("Lute.fontSize", JSON.stringify(clamped));
}

function handleSetTextWidth(width, dispatch) {
  const rounded = Number(width.toFixed(3));
  const clamped = clamp(rounded, 30, 100);
  dispatch({ type: "setTextWidth", payload: clamped });
  localStorage.setItem("Lute.textWidth", JSON.stringify(clamped));
}

export {
  handleToggleHighlights,
  handleSetHighlights,
  handleSetFocusMode,
  handleSetColumnCount,
  handleSetLineHeight,
  handleSetFontSize,
  handleSetTextWidth,
  handleToggleFocusMode,
};
