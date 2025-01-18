import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getPressedKeysAsString } from "@actions/utils";
import { settingsQuery } from "@settings/api/settings";
import {
  handleMoveCursor,
  resetFocusActiveSentence,
  startHoverMode,
} from "@actions/interactions-desktop";
import { handleCopy } from "@actions/copy";
import { handleTranslate } from "@actions/translation";
import {
  incrementStatusForMarked,
  updateStatusForMarked,
} from "@actions/status";
import { handleToggleFocusMode, handleToggleHighlights } from "@actions/page";

function useSetupShortcuts(dispatch, language, setActiveTerm, onThemeFormOpen) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: settings } = useQuery(settingsQuery);

  useEffect(() => {
    function ignoreKeydown(e) {
      const searchParams = new URLSearchParams(window.location.search);
      const inEditMode = searchParams.get("edit") === "true";
      const isTyping = e.target.matches("input, textarea");
      return inEditMode || isTyping;
    }

    function setupKeydownEvents(e) {
      if (ignoreKeydown(e)) return;

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
          onThemeFormOpen(false);
        },

        [settings.hotkey_PrevWord]: () => handleMoveCursor(".word", prev),
        [settings.hotkey_NextWord]: () => handleMoveCursor(".word", next),
        [settings.hotkey_PrevUnknownWord]: () =>
          handleMoveCursor(".word.status0", prev),
        [settings.hotkey_NextUnknownWord]: () =>
          handleMoveCursor(".word.status0", next),
        [settings.hotkey_PrevSentence]: () =>
          handleMoveCursor(".sentencestart", prev),
        [settings.hotkey_NextSentence]: () =>
          handleMoveCursor(".sentencestart", next),

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
          onThemeFormOpen((v) => !v);
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
}

export default useSetupShortcuts;
