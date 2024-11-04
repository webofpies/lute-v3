function getFromLocalStorage(item, defaultVal) {
  const storageVal = localStorage.getItem(item);

  if (!storageVal || isNaN(storageVal)) {
    return Number(defaultVal);
  } else {
    return Number(storageVal);
  }
}

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
    navigator.clipboard.writeText(text);
    return text;
  } catch (error) {
    console.error("Failed to copy: ", error);
    return false;
  }
}

export {
  getFromLocalStorage,
  convertPixelsToRem,
  clamp,
  getPressedKeysAsString,
  copyToClipboard,
};
