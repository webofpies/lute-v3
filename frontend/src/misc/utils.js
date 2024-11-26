function getFromLocalStorage(item, defaultVal) {
  const storageVal = JSON.parse(localStorage.getItem(item));

  if (storageVal === null || isNaN(storageVal)) {
    return defaultVal;
  } else {
    return storageVal;
  }
}

const paneResizeStorage = (() => {
  function strip(name) {
    return name.replace("react-resizable-panels:", "");
  }

  return {
    getItem(name) {
      return JSON.parse(localStorage.getItem(strip(name)));
    },
    setItem(name, value) {
      localStorage.setItem(strip(name), JSON.stringify(value));
    },
  };
})();

function convertPixelsToRem(sizePx) {
  const bodyFontSize = window.getComputedStyle(
    document.querySelector("body")
  ).fontSize;
  const sizeRem = sizePx / parseFloat(bodyFontSize);
  return sizeRem;
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Get the pressed keys as a string, eg 'meta-c', 'shift-a'.
 *
 * Note that there _must_ be a "regular" key pressed as well.
 * If only meta/alt/ctl/shift are pressed, returns null.
 */
function getPressedKeysAsString(event) {
  const keys = [];

  // Check for modifier keys
  if (event.ctrlKey) keys.push("ctrl");
  if (event.shiftKey) keys.push("shift");
  if (event.altKey) keys.push("alt");
  if (event.metaKey) keys.push("meta");

  // Map special keys to names if needed
  const keyMap = {
    " ": "space",
  };

  if (event.key == null) {
    // window.alert("no key for event?");
    return null;
  }

  const actual_key = keyMap[event.key] || event.key.toLowerCase();
  if (["shift", "ctrl", "alt", "meta", "control"].includes(actual_key))
    return null;

  keys.push(actual_key);
  const ret = keys.join("+");
  // window.alert(`got hotkey = ${ret}`);
  return ret;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return text;
  } catch (error) {
    console.error("Failed to copy: ", error);
    return false;
  }
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

/** Get the textitems whose span_attribute value matches that of the
 * current active/hovered word.  If span_attribute is null, return
 * all. */
function getMatchedTextItems(textitem, attr) {
  const single = document.querySelectorAll(".kwordmarked");
  const multi = document.querySelectorAll(".newmultiterm");
  const hasSelection = single.length > 0 || multi.length > 0;

  if (!(textitem || hasSelection)) return [];

  let textitems = [];

  single.length > 0
    ? (textitems = single)
    : multi.length > 0
      ? (textitems = multi)
      : (textitems = [textitem]);

  const elements = Array.from(textitems).toSorted(
    (a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order)
  );

  if (!attr) return textitems;

  const attrValue = elements[0].getAttribute(`data-${attr}`);
  const selected = document.querySelectorAll(
    `.textitem[data-${attr}="${attrValue}"]`
  );

  return Array.from(selected);
}

function addFlash(elements) {
  elements.forEach((element) => {
    element.classList.add("flash");
  });
}

function removeFlash() {
  Array.from(document.querySelectorAll(".flash")).forEach((item) =>
    item.classList.remove("flash")
  );
}

function removeAllContainingClass(className) {
  const elements = Array.from(document.querySelectorAll(`.${className}`));
  elements.forEach((element) => element.classList.remove(`${className}`));
}

function convertSecsToDisplayString(secs) {
  const minutes = Math.floor(secs / 60);
  const seconds = (secs % 60).toFixed(1);
  const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const s = secs % 60 < 10 ? `0${seconds}` : `${seconds}`;
  return `${m}:${s}`;
}

export {
  paneResizeStorage,
  getFromLocalStorage,
  convertPixelsToRem,
  clamp,
  getPressedKeysAsString,
  copyToClipboard,
  getTextItemsText,
  getMatchedTextItems,
  addFlash,
  removeFlash,
  removeAllContainingClass,
  convertSecsToDisplayString,
};
