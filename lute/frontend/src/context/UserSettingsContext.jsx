import { createContext } from "react";
// import { useQuery, useMutation, queryClient } from "@tanstack/react-query";

export const UserSettingsContext = createContext();

export function UserSettingsProvider({ children }) {
  // Fetch user settings using React Query
  // const {
  //   data: settings,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery(["userSettings"], () => fetchUserSettings(), {
  //
  // });

  // Mutation to save user settings
  // const mutation = useMutation(saveUserSettings, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["userSettings"]);
  //   },
  // });

  const settings = {
    hotkey_StartHover: "escape",
    hotkey_PrevWord: "arrowleft",
    hotkey_NextWord: "arrowright",
    hotkey_StatusUp: "arrowup",
    hotkey_StatusDown: "arrowdown",
    hotkey_Bookmark: "b",
    hotkey_CopySentence: "c",
    hotkey_CopyPara: "shift+c",
    hotkey_TranslateSentence: "t",
    hotkey_TranslatePara: "shift+t",
    hotkey_NextTheme: "m",
    hotkey_ToggleHighlight: "h",
    hotkey_ToggleFocus: "f",
    hotkey_Status1: "1",
    hotkey_Status2: "2",
    hotkey_Status3: "3",
    hotkey_Status4: "4",
    hotkey_Status5: "5",
    hotkey_StatusIgnore: "i",
    hotkey_StatusWellKnown: "w",
    hotkey_CopyPage: "",
    hotkey_DeleteTerm: "",
    hotkey_EditPage: "",
    hotkey_TranslatePage: "",
    hotkey_PrevUnknownWord: "",
    hotkey_NextUnknownWord: "",
    hotkey_PrevSentence: "",
    hotkey_NextSentence: "",

    showHighlights: true,
  };

  return (
    <UserSettingsContext.Provider
      value={{
        settings,
        // isLoading,
        // isError,
        // error,
        // saveUserSettings: mutation.mutate,
      }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

// Function to fetch user settings
// async function fetchUserSettings(userId) {
//   const response = await fetch(`/api/user-settings?user_id=${userId}`);
//   if (!response.ok) {
//     throw new Error("Error fetching user settings");
//   }
//   const data = await response.json();
//   return data;
// }

// // Function to save user settings
// async function saveUserSettings({ userId, settings }) {
//   const response = await fetch("/api/user-settings", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ user_id: userId, settings }),
//   });
//   if (!response.ok) {
//     throw new Error("Error saving user settings");
//   }
// }
