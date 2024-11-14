import {
  handleAddBookmark,
  handleTranslate,
  handleCopy,
  adjustFontSize,
  adjustLineHeight,
  setColumnCount,
  handleEditPage,
} from "./textActions";
import {
  moveCursor,
  updateStatusForMarked,
  incrementStatusForMarked,
  goToNextTheme,
} from "./keydown";
import { startHoverMode } from "../lute";

export const actions = {
  translateSelection: handleTranslate,
  translateSentence: handleTranslate,
  translateParagraph: handleTranslate,
  translatePage: handleTranslate,

  copySelection: handleCopy,
  copySentence: handleCopy,
  copyParagraph: handleCopy,
  copyPage: handleCopy,

  fontSizeIncrease: adjustFontSize,
  fontSizeDecrease: adjustFontSize,

  lineHeightIncrease: adjustLineHeight,
  lineHeightDecrease: adjustLineHeight,

  setColumnCountOne: setColumnCount,
  setColumnCountTwo: setColumnCount,

  addBookmark: () => handleAddBookmark(),

  hotkey_StartHover: startHoverMode,
  hotkey_PrevWord: moveCursor,
  hotkey_NextWord: moveCursor,
  hotkey_PrevUnknownWord: moveCursor,
  hotkey_NextUnknownWord: moveCursor,
  hotkey_PrevSentence: moveCursor,
  hotkey_NextSentence: moveCursor,

  hotkey_Bookmark: handleAddBookmark,
  hotkey_CopySentence: handleCopy,
  hotkey_CopyPara: handleCopy,
  hotkey_CopyPage: handleCopy,
  hotkey_TranslateSentence: handleTranslate,
  hotkey_TranslatePara: handleTranslate,
  hotkey_TranslatePage: handleTranslate,

  hotkey_StatusUp: incrementStatusForMarked,
  hotkey_StatusDown: incrementStatusForMarked,
  hotkey_Status1: updateStatusForMarked,
  hotkey_Status2: updateStatusForMarked,
  hotkey_Status3: updateStatusForMarked,
  hotkey_Status4: updateStatusForMarked,
  hotkey_Status5: updateStatusForMarked,
  hotkey_StatusIgnore: updateStatusForMarked,
  hotkey_StatusWellKnown: updateStatusForMarked,
  hotkey_DeleteTerm: updateStatusForMarked,
  hotkey_EditPage: handleEditPage,
  hotkey_NextTheme: goToNextTheme,
  hotkey_ToggleHighlight: "",
};
