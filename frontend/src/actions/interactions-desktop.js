import {
  addClassToElements,
  getTextItemsText,
  removeAllContainingClass,
} from "./utils";

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
    addClassToElements(selected, "newmultiterm");
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
    textitems: selected,
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

  e.target.classList.add("kwordmarked");

  // Normal click without Shift
  if (!e.shiftKey) {
    removeAllContainingClass("kwordmarked");
    e.target.classList.add("kwordmarked");

    return {
      data: parseInt(e.target.dataset.wid),
      type: "single",
      textitems: [e.target],
    };
  } else {
    // shift clicking multiple words
    const marked = document.querySelectorAll(".kwordmarked");
    if (marked.length > 0) {
      return {
        data: Array.from(marked).map((item) => parseInt(item.dataset.wid)),
        type: "shift",
        textitems: marked,
      };
    }
  }

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

function focusActiveSentence(textitems) {
  // make all textitems ghosted, then remove it from active sentence
  Array.from(document.querySelectorAll(".textitem")).forEach((t) =>
    t.classList.add("ghosted")
  );

  const first = Number(textitems[0].dataset.sentenceId);
  const last = Number(textitems.at(-1).dataset.sentenceId);

  Array.from({ length: last - first + 1 }, (_, index) => first + index).forEach(
    (id) =>
      document
        .querySelectorAll(`[data-sentence-id="${id}"]`)
        .forEach((t) => t.classList.remove("ghosted"))
  );
}

function resetFocusActiveSentence() {
  Array.from(document.querySelectorAll(".textitem")).forEach((t) =>
    t.classList.remove("ghosted")
  );
}

/** Move to the next/prev candidate determined by the selector.
 * direction is 1 if moving "right", -1 if moving "left" -
 * note that these switch depending on if the language is right-to-left! */
function handleMoveCursor(selector, direction = 1) {
  const firstElement = _firstSelectedElement();
  const firstElementOrder =
    firstElement != null ? parseInt(firstElement.dataset.order) : 0;
  let candidates = Array.from(document.querySelectorAll(selector));
  let comparator = function (a, b) {
    return a > b;
  };

  if (direction < 0) {
    candidates = candidates.reverse();
    comparator = function (a, b) {
      return a < b;
    };
  }

  const match = candidates.find((el) =>
    comparator(parseInt(el.dataset.order), firstElementOrder)
  );

  if (match) {
    _updateCursor(match);
    // Highlight the word if we're jumping around a lot.
    if (selector !== ".word") {
      const matchOrder = parseInt(match.dataset.order);
      const matchClass = `highlight_${matchOrder}`;
      match.classList.add("flash-highlight", `${matchClass}`);
      setTimeout(
        () =>
          document
            .querySelector(`.${matchClass}`)
            .classList.remove("flash-highlight", `${matchClass}`),
        1000
      );
    }
  }
}
/** Update cursor, clear prior cursors. */
function _updateCursor(target) {
  document
    .querySelectorAll("span.newmultiterm, span.kwordmarked, span.wordhover")
    .forEach((item) => {
      item.classList.remove("newmultiterm", "kwordmarked", "wordhover");
    });
  // for highlights in no highlights mode
  target.classList.add("wordhover");

  target.classList.add("kwordmarked");
  // ! NEED? to save current term data order
  // const currentTermDataOrder = parseInt(target.dataset.order);
}

/** First selected/hovered element, or null if nothing. */
function _firstSelectedElement() {
  const elements = Array.from(
    document.querySelectorAll(".kwordmarked, .newmultiterm, .wordhover")
  ).sort((a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order));

  return elements.length > 0 ? elements[0] : null;
}

export {
  startHoverMode,
  handleMouseDown,
  handleMouseOver,
  handleMouseUp,
  hoverOut,
  handleClickOutside,
  focusActiveSentence,
  resetFocusActiveSentence,
  handleMoveCursor,
};
