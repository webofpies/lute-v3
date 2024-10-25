import { getFromLocalStorage, convertPixelsToRem, clamp } from "./utils";

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

export { adjustFontSize, adjustLineHeight, setColumnCount };
