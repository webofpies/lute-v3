import { useContext, useEffect } from "react";
import { useNavigation } from "react-router-dom";
import { nprogress } from "@mantine/nprogress";
import { UserSettingsContext } from "../context/UserSettingsContext";
import { getPressedKeysAsString } from "../misc/utils";
import { startHoverMode } from "../lute";
import {
  handleAddBookmark,
  handleCopy,
  handleTranslate,
  incrementStatusForMarked,
  moveCursor,
  updateStatusForMarked,
} from "../misc/actions";

function useInitialize(book) {
  const { settings } = useContext(UserSettingsContext);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  });

  useEffect(() => {
    const title = document.title;
    document.title = `Reading "${book.title}"`;

    return () => {
      document.title = title;
    };
  }, [book.title]);

  useEffect(() => {
    function handleKeydown(e) {
      setupKeydownEvents(e, book, settings);
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);
}

export { useInitialize };

function setupKeydownEvents(e, book, settings) {
  if (document.querySelectorAll(".word").length === 0) {
    return; // Nothing to do.
  }

  let selected;

  const next = book.isRightToLeft ? -1 : 1;
  const prev = -1 * next;

  // Map of shortcuts to lambdas:
  const map = {
    [settings.hotkey_StartHover]: startHoverMode,

    [settings.hotkey_PrevWord]: () => moveCursor(".word", prev),
    [settings.hotkey_NextWord]: () => moveCursor(".word", next),
    [settings.hotkey_PrevUnknownWord]: () => moveCursor(".word.status0", prev),
    [settings.hotkey_NextUnknownWord]: () => moveCursor(".word.status0", next),
    [settings.hotkey_PrevSentence]: () => moveCursor(".sentencestart", prev),
    [settings.hotkey_NextSentence]: () => moveCursor(".sentencestart", next),

    [settings.hotkey_CopySentence]: () => handleCopy(selected, "sentence"),
    [settings.hotkey_CopyPara]: () => handleCopy(selected, "paragraph"),
    [settings.hotkey_CopyPage]: () => handleCopy(selected, null),

    [settings.hotkey_TranslateSentence]: () => handleTranslate("sentence"),
    [settings.hotkey_TranslatePara]: () => handleTranslate("paragraph"),
    [settings.hotkey_TranslatePage]: () => handleTranslate(null),

    [settings.hotkey_StatusUp]: () => incrementStatusForMarked(+1),
    [settings.hotkey_StatusDown]: () => incrementStatusForMarked(-1),

    [settings.hotkey_Status1]: () => updateStatusForMarked(1),
    [settings.hotkey_Status2]: () => updateStatusForMarked(2),
    [settings.hotkey_Status3]: () => updateStatusForMarked(3),
    [settings.hotkey_Status4]: () => updateStatusForMarked(4),
    [settings.hotkey_Status5]: () => updateStatusForMarked(5),
    [settings.hotkey_StatusIgnore]: () => updateStatusForMarked(98),
    [settings.hotkey_StatusWellKnown]: () => updateStatusForMarked(99),
    [settings.hotkey_DeleteTerm]: () => updateStatusForMarked(0),

    [settings.hotkey_Bookmark]: () => handleAddBookmark(book),
    [settings.hotkey_EditPage]: () => "handleEditPage(book)",

    [settings.hotkey_NextTheme]: "",
    [settings.hotkey_ToggleHighlight]: "",
    [settings.hotkey_ToggleFocus]: "",
  };

  const key = getPressedKeysAsString(e);
  if (key in map) {
    selected = e.target.matches(".word") ? e.target : null;
    // Override any existing event - e.g., if "up" arrow is in the map,
    // don't scroll screen.
    e.preventDefault();
    map[key]();
  }
}
