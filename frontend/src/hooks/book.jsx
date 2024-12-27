import { useEffect, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useSearchParams } from "react-router-dom";
import { nprogress } from "@mantine/nprogress";
import { getFromLocalStorage, getPressedKeysAsString } from "../misc/utils";
import { resetFocusActiveSentence, startHoverMode } from "../lute";
import { settingsQuery } from "../queries/settings";
import {
  // handleAddBookmark,
  handleCopy,
  handleToggleFocusMode,
  handleToggleHighlights,
  handleTranslate,
  incrementStatusForMarked,
  moveCursor,
  updateStatusForMarked,
} from "../misc/actions";

function reducer(state, action) {
  switch (action.type) {
    case "setFocusMode":
      return { ...state, focusMode: action.payload };
    case "toggleFocusMode":
      return { ...state, focusMode: !state.focusMode };
    case "setHighlights":
      return { ...state, highlights: action.payload };
    case "toggleHighlights":
      return { ...state, highlights: !state.highlights };
    case "setColumnCount":
      return { ...state, columnCount: action.payload };
    case "setLineHeight":
      return { ...state, lineHeight: action.payload };
    case "setFontSize":
      return { ...state, fontSize: action.payload };
    case "setTextWidth":
      return { ...state, textWidth: action.payload };
    default:
      throw new Error();
  }
}

const initialState = {
  fontSize: 1,
  lineHeight: 1,
  columnCount: 1,
  highlights: true,
  focusMode: false,
  textWidth: 50,
};

function useInitialize(book, language, setActiveTerm, setOpenThemeForm) {
  const { data: settings } = useQuery(settingsQuery());
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, dispatch] = useReducer(reducer, {
    fontSize: getFromLocalStorage("Lute.fontSize", initialState.fontSize),
    lineHeight: getFromLocalStorage("Lute.lineHeight", initialState.lineHeight),
    columnCount: getFromLocalStorage(
      "Lute.columnCount",
      initialState.columnCount
    ),
    highlights: getFromLocalStorage("Lute.highlights", initialState.highlights),
    focusMode: getFromLocalStorage("Lute.focusMode", initialState.focusMode),
    textWidth: getFromLocalStorage("Lute.textWidth", initialState.textWidth),
  });

  const navigation = useNavigation();
  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  }, [navigation.state]);

  useEffect(() => {
    const title = document.title;
    document.title = `Reading "${book.title}"`;

    return () => {
      document.title = title;
    };
  }, [book.title]);

  useEffect(() => {
    function setupKeydownEvents(e) {
      if (e.target.matches("input, textarea")) return;

      let selected;

      const next = language.isRightToLeft ? -1 : 1;
      const prev = -1 * next;

      // Map of shortcuts to lambdas:
      const map = {
        [settings.hotkey_StartHover]: () => {
          searchParams.delete("edit");
          setSearchParams(searchParams);
          startHoverMode();
          setActiveTerm({ data: null });
          resetFocusActiveSentence();
          setOpenThemeForm(false);
        },

        [settings.hotkey_PrevWord]: () => moveCursor(".word", prev),
        [settings.hotkey_NextWord]: () => moveCursor(".word", next),
        [settings.hotkey_PrevUnknownWord]: () =>
          moveCursor(".word.status0", prev),
        [settings.hotkey_NextUnknownWord]: () =>
          moveCursor(".word.status0", next),
        [settings.hotkey_PrevSentence]: () =>
          moveCursor(".sentencestart", prev),
        [settings.hotkey_NextSentence]: () =>
          moveCursor(".sentencestart", next),

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

        // [settings.hotkey_Bookmark]: () => handleAddBookmark(book),
        [settings.hotkey_EditPage]: () => {
          setActiveTerm({ data: null });
          resetFocusActiveSentence();
          setSearchParams({ edit: "true" });
        },

        [settings.hotkey_NextTheme]: () => {
          setOpenThemeForm((v) => !v);
          setActiveTerm({ data: null });
          resetFocusActiveSentence();
        },
        [settings.hotkey_ToggleHighlight]: () =>
          handleToggleHighlights(dispatch),
        [settings.hotkey_ToggleFocus]: () => handleToggleFocusMode(dispatch),
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

    document.addEventListener("keydown", setupKeydownEvents);

    return () => {
      document.removeEventListener("keydown", setupKeydownEvents);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return [state, dispatch];
}

export { useInitialize };
