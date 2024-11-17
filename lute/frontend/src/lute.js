import { getTextItemsText, removeAllContainingClass } from "./misc/utils";

let selectionStart = null;
let selectionStartShiftHeld = false;
let currentTermDataOrder = -1;

function startHoverMode() {
  removeAllContainingClass("kwordmarked");

  const words = Array.from(document.querySelectorAll(".word"));
  const currentWord = words.filter(
    (word) => word.dataset.order === currentTermDataOrder
  );

  if (currentWord.length === 1) {
    const w = currentWord[0];
    w.classList.add("wordhover");
    w.classList.add(w.dataset.statusClass);
  }

  removeAllContainingClass("newmultiterm");
  selectionStart = null;
}
// selection started
function handleMouseDown(e) {
  removeAllContainingClass("newmultiterm");
  e.target.classList.add("newmultiterm");
  selectionStart = e.target;
  selectionStartShiftHeld = e.shiftKey;
  currentTermDataOrder = parseInt(e.target.dataset.order);
}
// mouse over during selection or without it
function handleMouseOver(e) {
  if (selectionStart) {
    removeAllContainingClass("newmultiterm");
    const selected = getSelectedInRange(selectionStart, e.target);
    selected.forEach((el) => el.classList.add("newmultiterm"));
  } else {
    removeAllContainingClass("wordhover");

    if (document.querySelectorAll(".kwordmarked").length === 0) {
      e.target.classList.add("wordhover");
      currentTermDataOrder = parseInt(e.target.dataset.order);
    }
  }
}
// selection ended
function handleMouseUp(e) {
  if (selectionStart.getAttribute("id") === e.target.getAttribute("id")) {
    return singleWordClicked(e);
  }

  removeAllContainingClass("kwordmarked");

  const selected = getSelectedInRange(selectionStart, e.target);
  // return selected text for copy
  if (selectionStartShiftHeld) {
    const text = getTextItemsText(selected);
    startHoverMode();

    return { data: text, type: "copy" };
  }

  selectionStart = null;
  selectionStartShiftHeld = false;

  const selectedMultiTerm = getSelectedMultiTerm(selected);
  return {
    data: selectedMultiTerm.text,
    langID: selectedMultiTerm.langID,
    type: "multi",
  };
}

function getSelectedMultiTerm(selected) {
  const textParts = selected.map((el) => el.dataset.text);
  const cleanText = textParts.join("").trim();
  const text = cleanText.replace(/\//g, "LUTESLASH");
  const langID = parseInt(selected[0].dataset.langId);
  return { text, langID };
}

function singleWordClicked(e) {
  removeAllContainingClass("newmultiterm");
  selectionStart = null;

  e.target.classList.remove("wordhover");
  currentTermDataOrder = parseInt(e.target.dataset.order);

  // If already clicked, remove the click marker.
  if (e.target.classList.contains("kwordmarked")) {
    e.target.classList.remove("kwordmarked");

    if (document.querySelectorAll(".kwordmarked").length === 0) {
      e.target.classList.add("wordhover");
      startHoverMode();
    }
    // selecting same word. sending null data for form to close
    return { data: null };
  }

  // Normal click without Shift
  if (!e.shiftKey) {
    removeAllContainingClass("kwordmarked");
    e.target.classList.add("kwordmarked");

    return {
      data: parseInt(e.target.dataset.wid),
      type: "single",
    };
  }

  // add mark for Shift click
  e.target.classList.add("kwordmarked");
  // Shift click. returns null so term form doesn't do anything
  return null;
}

function hoverOut() {
  removeAllContainingClass("wordhover");
}

function handleClickOutside(e) {
  if (e.button !== 0) return;
  if (!e.target.classList.contains("textitem")) {
    removeAllContainingClass("kwordmarked");
    removeAllContainingClass("newmultiterm");
    return { data: null };
  }

  return null;
}

function getSelectedInRange(startEl, endEl) {
  const [startord, endord] = [
    parseInt(startEl.dataset.order),
    parseInt(endEl.dataset.order),
  ].sort((a, b) => a - b);

  const textitems = Array.from(document.querySelectorAll(".textitem"));
  const selected = textitems.filter((textitem) => {
    const ord = parseInt(textitem.dataset.order);
    return ord >= startord && ord <= endord;
  });

  return selected;
}

export {
  startHoverMode,
  handleMouseDown,
  handleMouseOver,
  handleMouseUp,
  hoverOut,
  handleClickOutside,
};
