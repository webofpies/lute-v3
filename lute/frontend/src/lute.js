export function createInteractionFunctions(
  selectionStartRef,
  currentTermDataOrderRef,
  selectedMultiTermRef
  // onSetSelectedTermID
) {
  function startHoverMode() {
    removeAllContainingClass("kwordmarked");

    const words = Array.from(document.querySelectorAll(".word"));
    const currentWord = words.filter((word) => {
      return word.dataset.order === currentTermDataOrderRef.current;
    });

    if (currentWord.length === 1) {
      const w = currentWord[0];
      w.classList.add("wordhover");
      w.classList.add(w.dataset.statusClass);
    }

    // if (hideDictPane) {
    //   onSetSelectedTermID(null);
    // }

    removeAllContainingClass("newmultiterm");
    selectionStartRef.current = null;
  }

  function selectionStarted(e) {
    removeAllContainingClass("newmultiterm");
    selectionStartRef.current = null;
    e.target.classList.add("newmultiterm");
    selectionStartRef.current = e.target;
    currentTermDataOrderRef.current = e.target.dataset.order;
  }

  function selectionOver(e) {
    if (selectionStartRef.current == null) return; // Not selecting
    removeAllContainingClass("newmultiterm");
    const selected = getSelectedInRange(selectionStartRef.current, e.target);
    selected.forEach((el) => el.classList.add("newmultiterm"));
  }

  function selectEnded(e) {
    if (
      selectionStartRef.current.getAttribute("id") ===
      e.target.getAttribute("id")
    ) {
      removeAllContainingClass("newmultiterm");
      selectionStartRef.current = null;
      selectedMultiTermRef.current = {};
      wordClicked(e);
      return;
    }

    removeAllContainingClass("kwordmarked");

    const selected = getSelectedInRange(selectionStartRef.current, e.target);
    if (e.key === "Shift") {
      // copy text (selected)
      startHoverMode();
      return;
    }

    // selected.length > 0 && show_multiword_term_edit_form(selected);
    selectedMultiTermRef.current = getSelectedMultiTerm(selected);
    selectionStartRef.current = null;
  }

  function getSelectedMultiTerm(selected) {
    const textParts = selected.map((el) => el.dataset.text);
    const text = textParts.join("").trim();
    const langID = parseInt(selected[0].dataset.langId);
    return { text, langID };
  }

  function wordClicked(e) {
    e.target.classList.remove("wordhover");
    currentTermDataOrderRef.current = e.target.dataset.order;

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
      // e.target.dataset.wid && onSetSelectedTermID(e.target.dataset.wid);
    }

    e.target.classList.add("kwordmarked");
  }

  function hoverOver(e) {
    removeAllContainingClass("wordhover");

    if (document.querySelectorAll(".kwordmarked").length === 0) {
      e.target.classList.add("wordhover");
      console.log("asdsd");
      currentTermDataOrderRef.current = e.target.dataset.order;
    }
  }

  function hoverOut() {
    removeAllContainingClass("wordhover");
  }

  return {
    hoverOut,
    hoverOver,
    selectionStarted,
    selectionOver,
    selectEnded,
  };
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
