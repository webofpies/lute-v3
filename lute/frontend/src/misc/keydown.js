import { copyToClipboard, getTextItemsText } from "./utils";

// let currentTermDataOrder;

const showHighlights = true;

// book id - handleEditPage, handleAddBookmark
// page num - handleEditPage, handleAddBookmark
// highlights - moveCursor -> updateCursor ->
// sentence dicts - handleTranslate -> showTextTranslation ->_get_translation_dict_index
// rtl - handleKeydown

// move handleCopy into the component

/** Move to the next/prev candidate determined by the selector.
 * direction is 1 if moving "right", -1 if moving "left" -
 * note that these switch depending on if the language is right-to-left! */
function moveCursor(selector, direction = 1) {
  const firstElement = firstSelectedElement();
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
    updateCursor(match);

    // Highlight the word if we're jumping around a lot.
    if (selector !== ".word") {
      // const matchOrder = parseInt(match.dataset.order);
      // const matchClass = `flash_${matchOrder}`;
      // $(match).addClass(`flashtextcopy ${matchClass}`);
      // setTimeout(
      //   () => $(`.${matchClass}`).removeClass(`flashtextcopy ${matchClass}`),
      //   1000
      // );
    }
  }
}

/** First selected/hovered element, or null if nothing. */
function firstSelectedElement() {
  const elements = Array.from(
    document.querySelectorAll(".kwordmarked, .newmultiterm, .wordhover")
  ).sort((a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order));

  return elements.length > 0 ? elements[0] : null;
}

/** Update cursor, clear prior cursors. */
function updateCursor(target) {
  document
    .querySelectorAll("span.newmultiterm, span.kwordmarked, span.wordhover")
    .forEach((item) => {
      item.classList.remove("newmultiterm", "kwordmarked", "wordhover");
    });
  removeStatusHighlights();
  target.classList.add("kwordmarked");
  // ! NEED? to save current term data order
  // const currentTermDataOrder = parseInt(target.dataset.order);
  applyStatusClass(target);
  // $(window).scrollTo(target, { axis: "y", offset: -150 });
  // show_term_edit_form(target);
}

/** Remove the status from elements, if not showing highlights. */
function removeStatusHighlights() {
  if (showHighlights) {
    /* Not removing anything, always showing highlights. */
    return;
  }
  Array.from(document.querySelectorAll("span.word")).forEach((item) =>
    item.classList.remove(item.dataset.statusClass)
  );
}

/** Status highlights.
/** Add the data-status-class to the term's classes. */
function applyStatusClass(el) {
  el.classList.add(el.dataset.statusClass);
}

function handleAddBookmark(bookId, pageNum) {
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
      book_id: bookId,
      page_num: pageNum,
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

function handleEditPage(bookId, pageNum) {
  location.href = `/read/editpage/${bookId}/${pageNum}`;
}

/** Copy the text of the textitemspans to the clipboard, and add a
 * color flash. */
function handleCopy(attr) {
  const textitems = getMatchedTextItems(attr);
  copyToClipboard(textitems);
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

/** Get the textitems whose span_attribute value matches that of the
 * current active/hovered word.  If span_attribute is null, return
 * all. */
function getMatchedTextItems(attr) {
  if (!attr) return Array.from(document.querySelectorAll(".textitem"));

  const elements = Array.from(
    document.querySelectorAll(".kwordmarked, .newmultiterm, .wordhover")
  ).sort((a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order));

  if (elements.length === 0) return elements;

  const attrValue = elements[0].getAttribute(`data-${attr}`);

  const selected = document.querySelectorAll(
    `.textitem[data-${attr}="${attrValue}"]`
  );

  return Array.from(selected);
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

function toggleFocus() {
  const focusChk = document.getElementById("focus");
  const event = new Event("change");
  focusChk.checked = !focusChk.checked;
  focusChk.dispatchEvent(event);
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
  $.ajax({
    url: "/theme/next",
    type: "post",
    dataType: "JSON",
    contentType: "application/json",
    success: function () {
      location.reload();
    },
    error: function (response, status, err) {
      const msg = {
        response: response,
        status: status,
        error: err,
      };
      console.log(`failed: ${JSON.stringify(msg, null, 2)}`);
    },
  });
}

/* Toggle highlighting, and reload the page. */
function toggleHighlight() {
  $.ajax({
    url: "/theme/toggle_highlight",
    type: "post",
    dataType: "JSON",
    contentType: "application/json",
    success: function () {
      location.reload();
    },
    error: function (response, status, err) {
      const msg = {
        response: response,
        status: status,
        error: err,
      };
      console.log(`failed: ${JSON.stringify(msg, null, 2)}`);
    },
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
  const firtstEl = elements[0];
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

  // let reload_text_div = function () {
  //   const bookid = $("#book_id").val();
  //   const pagenum = $("#page_num").val();
  //   const url = `/read/renderpage/${bookid}/${pagenum}`;
  //   const repel = $("#thetext");
  //   repel.load(url, remarkSelectedIds);
  // };

  $.ajax({
    url: "/term/bulk_update_status",
    type: "post",
    data: data,
    dataType: "JSON",
    contentType: "application/json",
    success: function () {
      // reload_text_div();
      if (elements.length == 1) {
        update_term_form(firtstEl, firstStatus);
      }
    },
    error: function (response, status, err) {
      const msg = {
        response: response,
        status: status,
        error: err,
      };
      console.log(`failed: ${JSON.stringify(msg, null, 2)}`);
    },
  });
}

/**
 * If the term editing form is visible when reading, and a hotkey is hit,
 * the form status should also update.
 */
function update_term_form(el, new_status) {
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
  moveCursor,
  incrementStatusForMarked,
  updateStatusForMarked,
  handleAddBookmark,
  handleCopy,
  handleEditPage,
  handleTranslate,
  goToNextTheme,
  toggleHighlight,
  toggleFocus,
};
