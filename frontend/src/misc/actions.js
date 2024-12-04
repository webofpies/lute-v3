import {
  getTextItemsText,
  getMatchedTextItems,
  copyToClipboard,
  clamp,
  addFlash,
  removeFlash,
  getFromLocalStorage,
} from "./utils";

function handleAddBookmark(book) {
  let title = prompt(`Enter bookmark title, or Cancel to quit`);

  if (!title) return;

  fetch(`/bookmarks/add`, {
    method: "POST",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      book_id: book.id,
      page_num: book.currentPage,
    }),
  })
    .then((resp) => resp.json())
    .then((json) => {
      if (json?.success === true) {
        alert(`Bookmark "${title}" added.`);
      } else {
        alert(`Unable to add bookmark. ${json?.reason || "Unknown reason"}`);
      }
    });
}

/** Show the translation using the next dictionary. */
function handleTranslate(attr) {
  const tis = getMatchedTextItems(attr);
  const text = getTextItemsText(tis);
  showTextTranslation(text);
}

// LUTE_USER_SETTINGS.open_popup_in_new_tab
function showTextTranslation(text, dicts, newTab) {
  if (text == "") return;

  if (dicts.length == 0) {
    console.log("No sentence translation uris configured.");
    return;
  }

  const dict_index = _get_translation_dict_index(text, dicts);
  const userdict = dicts[dict_index];

  const lookup = encodeURIComponent(text);
  const url = userdict.replace("###", lookup);
  if (url[0] == "*") {
    const finalurl = url.substring(1); // drop first char.
    let settings =
      "width=800, height=600, scrollbars=yes, menubar=no, resizable=yes, status=no";

    if (newTab) settings = null;
    window.open(finalurl, "dictwin", settings);
  } else {
    top.frames.wordframe.location.href = url;
    // $("#read_pane_right").css("grid-template-rows", "1fr 0");
  }
}

// LUTE_SENTENCE_LOOKUP_URIS is rendered in templates/read/index.html.
// Hitting "t" repeatedly cycles through the uris.  Moving to a new
// sentence resets the order.

var LUTE_LAST_SENTENCE_TRANSLATION_TEXT = "";
var LUTE_CURR_SENTENCE_TRANSLATION_DICT_INDEX = 0;

/** Cycle through the LUTE_SENTENCE_LOOKUP_URIS.
 * If the current sentence is the same as the last translation,
 * move to the next sentence dictionary; otherwise start the cycle
 * again (from index 0).
 */
let _get_translation_dict_index = function (sentence, dicts) {
  const dict_count = dicts.length;
  if (dict_count == 0) return 0;
  let new_index = LUTE_CURR_SENTENCE_TRANSLATION_DICT_INDEX;
  if (LUTE_LAST_SENTENCE_TRANSLATION_TEXT != sentence) {
    // New sentence, start at beginning.
    new_index = 0;
  } else {
    // Same sentence, next dict.
    new_index += 1;
    if (new_index >= dict_count) new_index = 0;
  }
  LUTE_LAST_SENTENCE_TRANSLATION_TEXT = sentence;
  LUTE_CURR_SENTENCE_TRANSLATION_DICT_INDEX = new_index;
  return new_index;
};

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

async function _copyUnit(textitem, unit) {
  let attr;
  let matched;

  if (unit === "page")
    matched = Array.from(document.querySelectorAll(".textitem"));
  else {
    switch (unit) {
      case "sentence":
        attr = "sentence-id";
        break;
      case "paragraph":
        attr = "paragraph-id";
        break;
      case "":
        attr = null;
        break;
    }
    matched = getMatchedTextItems(textitem, attr);
  }

  const text = getTextItemsText(matched);
  await copyToClipboard(text);

  return matched;
}

async function handleCopy(textitem, unit) {
  const res = await _copyUnit(textitem, unit);
  addFlash(res);
  setTimeout(() => removeFlash(), 1000);
}

/** Move to the next/prev candidate determined by the selector.
 * direction is 1 if moving "right", -1 if moving "left" -
 * note that these switch depending on if the language is right-to-left! */
function moveCursor(selector, direction = 1) {
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

/** First selected/hovered element, or null if nothing. */
function _firstSelectedElement() {
  const elements = Array.from(
    document.querySelectorAll(".kwordmarked, .newmultiterm, .wordhover")
  ).sort((a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order));

  return elements.length > 0 ? elements[0] : null;
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

function updateStatusForMarked(new_status) {
  const elements = Array.from(
    document.querySelectorAll("span.kwordmarked, span.wordhover")
  );
  const updates = [createStatusUpdateHash(new_status, elements)];
  post_bulk_update(updates);
}

function createStatusUpdateHash(new_status, elements) {
  return {
    new_status: new_status,
    termids: elements.map((el) => el.dataset.wid),
  };
}

/**
 * Change status using arrow keys for selected or hovered elements.
 */
function incrementStatusForMarked(shiftBy) {
  const elements = Array.from(
    document.querySelectorAll("span.kwordmarked, span.wordhover")
  );
  if (elements.length == 0) return;

  const statuses = [
    "status0",
    "status1",
    "status2",
    "status3",
    "status4",
    "status5",
    "status99",
  ];

  // Build payloads to update for each unique status that will be changing
  let status_elements = statuses.reduce((obj, status) => {
    obj[status] = [];
    return obj;
  }, {});

  elements.forEach((element) => {
    let s = element.dataset.statusClass ?? "missing";
    if (s in status_elements) status_elements[s].push(element);
  });

  // Convert map to update hashes.
  let updates = [];

  Object.entries(status_elements).forEach(([status, update_elements]) => {
    if (update_elements.length == 0) return;

    let status_index = statuses.indexOf(status);
    let new_index = status_index + shiftBy;
    new_index = Math.max(0, Math.min(statuses.length - 1, new_index));
    let new_status = Number(statuses[new_index].replace(/\D/g, ""));

    // Can't set status to 0 (that is for deleted/non-existent terms only).
    // TODO delete term from reading screen: setting to 0 could equal deleting term.
    if (new_index != status_index && new_status != 0) {
      updates.push(createStatusUpdateHash(new_status, update_elements));
    }
  });

  post_bulk_update(updates);
}

/** THEMES AND HIGHLIGHTS *************************/
/* Change to the next theme, and reload the page. */
function goToNextTheme() {
  fetch("/theme/next", {
    method: "POST", // Use POST method
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
  })
    .then((response) => {
      if (!response.ok) {
        // If the response is not ok, reject the promise
        return Promise.reject("Failed to load next theme");
      }
      return response.json(); // Parse the response as JSON
    })
    .then(() => {
      location.reload(); // Reload the page on success
    })
    .catch((error) => {
      // Handle any errors
      const msg = {
        error: error,
      };
      console.log(`failed: ${JSON.stringify(msg, null, 2)}`);
    });
}

function post_bulk_update(updates) {
  if (updates.length == 0) {
    // console.log("No updates.");
    return;
  }
  const elements = Array.from(
    document.querySelectorAll("span.kwordmarked, span.wordhover")
  );
  if (elements.length == 0) return;
  const firstEl = elements[0];
  const firstStatus = updates[0].new_status;
  const selectedIds = Array.from(
    document.querySelectorAll("span.kwordmarked")
  ).map((el) => el.getAttribute("id"));

  const data = JSON.stringify({ updates: updates });

  function remarkSelectedIds() {
    selectedIds.forEach((id) => {
      const element = document.getElementById(id);
      element.classList.add("kwordmarked");
    });

    if (selectedIds.length > 0) {
      Array.from(document.querySelectorAll("span.wordhover")).forEach(
        (element) => {
          element.classList.remove("wordhover");
        }
      );
    }
  }

  let reload_text_div = function () {
    const bookid = "";
    const pagenum = "";
    const url = `/read/renderpage/${bookid}/${pagenum}`;
    const repel = "";
    repel.load(url, remarkSelectedIds);
  };

  fetch("/term/bulk_update_status", {
    method: "POST", // Set the HTTP method to POST
    headers: {
      "Content-Type": "application/json", // Indicate the content type as JSON
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  })
    .then((response) => {
      if (!response.ok) {
        // Check if the response is successful
        return Promise.reject("Failed to update status");
      }
      return response.json(); // Parse JSON from the response
    })
    .then(() => {
      reload_text_div();
      if (elements.length === 1) {
        _updateTermForm(firstEl, firstStatus);
      }
    })
    .catch((error) => {
      const msg = {
        error: error,
      };
      console.log(`failed: ${JSON.stringify(msg, null, 2)}`);
    });
}

/**
 * If the term editing form is visible when reading, and a hotkey is hit,
 * the form status should also update.
 */
function _updateTermForm(el, new_status) {
  const sel = 'input[name="status"][value="' + new_status + '"]';
  var radioButton = top.frames.wordframe.document.querySelector(sel);
  if (radioButton) {
    radioButton.click();
  } else {
    // Not found - user might just be hovering over the element,
    // or multiple elements selected.
    // console.log("Radio button with value " + new_status + " not found.");
  }
}

export {
  handleToggleHighlights,
  handleSetHighlights,
  handleSetFocusMode,
  handleSetColumnCount,
  handleSetLineHeight,
  handleSetFontSize,
  handleAddBookmark,
  handleTranslate,
  handleCopy,
  moveCursor,
  updateStatusForMarked,
  incrementStatusForMarked,
  goToNextTheme,
  handleToggleFocusMode,
};
