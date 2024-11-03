let selectionStart = null;
let selectionStartShiftHeld = false;
let currentTermDataOrder = -1;
let selectedMultiTerm = {};

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
  selectionStartShiftHeld = e.key === "Shift";
  currentTermDataOrder = e.target.dataset.order;
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
      currentTermDataOrder = e.target.dataset.order;
    }
  }
}
// selection ended
function handleMouseUp(e) {
  if (selectionStart.getAttribute("id") === e.target.getAttribute("id")) {
    removeAllContainingClass("newmultiterm");
    selectionStart = null;
    selectedMultiTerm = {};
    wordClicked(e);
    return;
  }

  removeAllContainingClass("kwordmarked");

  const selected = getSelectedInRange(selectionStart, e.target);
  if (selectionStartShiftHeld) {
    // copy text (selected)
    startHoverMode();
    return;
  }

  selectedMultiTerm = getSelectedMultiTerm(selected);
  selectionStart = null;
  selectionStartShiftHeld = false;
}

function getSelectedMultiTerm(selected) {
  const textParts = selected.map((el) => el.dataset.text);
  const cleanText = textParts.join("").trim();
  const text = cleanText.replace(/\//g, "LUTESLASH");
  const langID = parseInt(selected[0].dataset.langId);
  return { text, langID };
}

function wordClicked(e) {
  e.target.classList.remove("wordhover");
  currentTermDataOrder = e.target.dataset.order;

  if (e.target.classList.contains("kwordmarked")) {
    e.target.classList.remove("kwordmarked");

    if (document.querySelectorAll(".kwordmarked").length === 0) {
      e.target.classList.add("wordhover");
      startHoverMode();
    }
    return;
  }

  // Not already clicked.
  if (e.key !== "Shift") {
    // Only one element should be marked clicked.
    removeAllContainingClass("kwordmarked");
  }

  e.target.classList.add("kwordmarked");
}

function hoverOut() {
  removeAllContainingClass("wordhover");
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

function removeAllContainingClass(className) {
  const elements = Array.from(document.querySelectorAll(`.${className}`));
  elements.forEach((element) => element.classList.remove(`${className}`));
}

export {
  startHoverMode,
  handleMouseDown,
  handleMouseOver,
  handleMouseUp,
  hoverOut,
  selectedMultiTerm,
};
