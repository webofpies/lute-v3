import {
  handleAddBookmark,
  handleTranslate,
  handleCopy,
  adjustFontSize,
  adjustLineHeight,
  setColumnCount,
} from "./textActions";

export const actions = {
  translateSelection: handleTranslate,
  translateSentence: handleTranslate,
  translateParagraph: handleTranslate,
  translatePage: handleTranslate,

  copySelection: handleCopy,
  copySentence: () => handleCopy("sentence-id"),
  copyParagraph: () => handleCopy("paragraph-id"),
  copyPage: handleCopy,

  fontSizeIncrease: () => adjustFontSize(1),
  fontSizeDecrease: () => adjustFontSize(-1),

  lineHeightIncrease: () => adjustLineHeight(0.1),
  lineHeightDecrease: () => adjustLineHeight(-0.1),

  setColumnCountOne: () => setColumnCount(1),
  setColumnCountTwo: () => setColumnCount(2),

  paneWidthIncrease: () => {},
  paneWidthDecrease: () => {},

  addBookmark: () => handleAddBookmark(),
};
