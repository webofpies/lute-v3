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

export { getFromLocalStorage, convertPixelsToRem, clamp };
