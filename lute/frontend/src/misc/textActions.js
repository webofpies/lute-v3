import {
  getTextItemsText,
  getMatchedTextItems,
  copyToClipboard,
  getPressedKeysAsString,
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

function setHighlightsOn(refs) {
  Object.values(refs).forEach((ref) => {
    ref.current.style.removeProperty("background-color");
  });
}

function setHighlightsOff(refs) {
  Object.values(refs).forEach((ref) => {
    ref.current.style.backgroundColor = "transparent";
  });
}

function setFontSize(refs, size) {
  Object.values(refs).forEach((ref) => {
    ref.current.style.fontSize = `${size}rem`;
  });
}

function setLineHeight(refs, amount) {
  Object.values(refs).forEach((ref) => {
    ref.current.style.marginBottom = `${amount}px`;
  });
}

function setColumnCount(ref, count) {
  ref.current.style.columnCount = count;
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

function setupKeydownEvents(e, actions, settings) {
  if (document.querySelectorAll(".word").length === 0) {
    return; // Nothing to do.
  }

  const next = settings.rtl ? -1 : 1;
  const prev = -1 * next;

  // Map of shortcuts to lambdas:
  const map = {
    [settings.hotkey_StartHover]: actions.hotkey_StartHover,
    [settings.hotkey_PrevWord]: () => actions.hotkey_PrevWord(".word", prev),
    [settings.hotkey_NextWord]: () => actions.hotkey_NextWord(".word", next),
    [settings.hotkey_PrevUnknownWord]: () =>
      actions.hotkey_PrevUnknownWord(".word.status0", prev),
    [settings.hotkey_NextUnknownWord]: () =>
      actions.hotkey_NextUnknownWord(".word.status0", next),
    [settings.hotkey_PrevSentence]: () =>
      actions.hotkey_PrevSentence(".sentencestart", prev),
    [settings.hotkey_NextSentence]: () =>
      actions.hotkey_NextSentence(".sentencestart", next),
    [settings.hotkey_StatusUp]: () => actions.hotkey_StatusUp(+1),
    [settings.hotkey_StatusDown]: () => actions.hotkey_StatusDown(-1),
    [settings.hotkey_Bookmark]: () =>
      actions.hotkey_Bookmark(settings.bookId, settings.pageNum),
    [settings.hotkey_CopySentence]: () =>
      actions.hotkey_CopySentence("sentence-id"),
    [settings.hotkey_CopyPara]: () => actions.hotkey_CopyPara("paragraph-id"),
    [settings.hotkey_CopyPage]: () => actions.hotkey_CopyPage(null),
    [settings.hotkey_EditPage]: () =>
      actions.hotkey_EditPage(settings.bookId, settings.pageNum),
    [settings.hotkey_TranslateSentence]: () =>
      actions.hotkey_TranslateSentence("sentence-id"),
    [settings.hotkey_TranslatePara]: () =>
      actions.hotkey_TranslatePara("paragraph-id"),
    [settings.hotkey_TranslatePage]: () => actions.hotkey_TranslatePage(null),
    [settings.hotkey_NextTheme]: actions.hotkey_NextTheme,
    [settings.hotkey_Status1]: () => actions.hotkey_Status1(1),
    [settings.hotkey_Status2]: () => actions.hotkey_Status2(2),
    [settings.hotkey_Status3]: () => actions.hotkey_Status3(3),
    [settings.hotkey_Status4]: () => actions.hotkey_Status4(4),
    [settings.hotkey_Status5]: () => actions.hotkey_Status5(5),
    [settings.hotkey_StatusIgnore]: () => actions.hotkey_StatusIgnore(98),
    [settings.hotkey_StatusWellKnown]: () => actions.hotkey_StatusWellKnown(99),
    [settings.hotkey_DeleteTerm]: () => actions.hotkey_DeleteTerm(0),

    [settings.hotkey_ToggleHighlight]: actions.hotkey_ToggleHighlight,
    [settings.hotkey_ToggleFocus]: actions.hotkey_ToggleFocus,
  };

  const key = getPressedKeysAsString(e);
  if (key in map) {
    // Override any existing event - e.g., if "up" arrow is in the map,
    // don't scroll screen.
    e.preventDefault();
    map[key]();
  }
}

export {
  setFontSize,
  setLineHeight,
  setColumnCount,
  handleAddBookmark,
  handleEditPage,
  handleTranslate,
  setHighlightsOn,
  setHighlightsOff,
  handleCopy,
  setupKeydownEvents,
};
