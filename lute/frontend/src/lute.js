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
  // copy selected text
  if (selectionStartShiftHeld) {
    const text = getTextItemsText(selected);
    copyToClipboard(text);
    startHoverMode();

    return null;
  }

  selectionStart = null;
  selectionStartShiftHeld = false;

  const selectedMultiTerm = getSelectedMultiTerm(selected);
  return {
    data: selectedMultiTerm.text,
    langID: selectedMultiTerm.langID,
    multi: true,
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
      multi: false,
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

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {})
    .catch(() => {});
}

/** Get the text from the text items, adding "\n" between paragraphs. */
function getTextItemsText(textItems) {
  if (textItems.length === 0) return "";

  function partitionByParagraphId(textItems) {
    const partitioned = {};
    textItems.forEach((item) => {
      const id = item.dataset.paragraphId;
      if (!partitioned[id]) partitioned[id] = [];
      partitioned[id].push(item);
    });
    return partitioned;
  }

  const paras = partitionByParagraphId(textItems);
  const paratexts = Object.entries(paras).map(([, textItems]) => {
    const text = textItems.map((item) => item.textContent).join("");
    return text.replace(/\u200B/g, "");
  });

  return paratexts.join("\n").trim();
}

export {
  startHoverMode,
  handleMouseDown,
  handleMouseOver,
  handleMouseUp,
  hoverOut,
};
