import {
  getTextItemsText,
  getMatchedTextItems,
  getFromLocalStorage,
  convertPixelsToRem,
  clamp,
  copyToClipboard,
} from "./utils";

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

function toggleFocus() {
  const focusChk = document.getElementById("focus");
  const event = new Event("change");
  focusChk.checked = !focusChk.checked;
  focusChk.dispatchEvent(event);
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

function adjustFontSize(delta) {
  const textItems = document.querySelectorAll(".textitem");
  const s = window.getComputedStyle(textItems[0]);
  const fontDefault = parseFloat(s.fontSize);
  const STORAGE_KEY = "fontSize";
  const fontSize = getFromLocalStorage(STORAGE_KEY, fontDefault);

  const newSize = clamp(fontSize + delta, 1, 50);

  const sizeRem = `${convertPixelsToRem(newSize)}rem`;
  textItems.forEach((item) => {
    item.style.fontSize = sizeRem;
  });

  localStorage.setItem(STORAGE_KEY, newSize);
}

function adjustLineHeight(delta) {
  const paras = document.querySelectorAll("#thetext p");
  const s = window.getComputedStyle(paras[0]);
  const lhDefault = parseFloat(s.getPropertyValue("line-height"));

  const STORAGE_KEY = "paraLineHeight";
  let current_h = getFromLocalStorage(STORAGE_KEY, lhDefault);
  current_h = Number(current_h.toPrecision(2));
  let new_h = clamp(current_h + delta, 1.25, 5);

  paras.forEach((p) => {
    p.style.lineHeight = new_h;
  });
  localStorage.setItem(STORAGE_KEY, new_h);
}

function setColumnCount(num) {
  const theText = document.getElementById("thetext");

  let columnCount = num;
  if (columnCount == null) {
    const s = window.getComputedStyle(theText);
    columnCount = getFromLocalStorage("columnCount", s.columnCount);
  }
  theText.style.columnCount = columnCount;
  localStorage.setItem("columnCount", columnCount);
}

async function handleCopy(textitem, unit) {
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

export {
  adjustFontSize,
  adjustLineHeight,
  setColumnCount,
  handleAddBookmark,
  handleEditPage,
  handleTranslate,
  toggleFocus,
  toggleHighlight,
  handleCopy,
};
