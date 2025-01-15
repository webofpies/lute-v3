import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/dates/styles.css";
import "mantine-react-table/styles.css";
import "./index.css";
import "./highlight.css";

import SoftwareInfo from "./components/Modals/SoftwareInfo";
import PageSpinner from "./components/PageSpinner/PageSpinner";

import { loader as homeLoader } from "./queries/home";
import { loader as bookLoader } from "./queries/book";
import { loader as languagesLoader } from "./queries/language";
import { loader as settingsLoader } from "./queries/settings";
import { loader as backupsLoader } from "./queries/backup";
import { loader as shortcutsLoader } from "./queries/shortcuts";
import { loader as termsLoader } from "./queries/term";

const queryClient = new QueryClient();

const theme = createTheme({
  fontFamily: "Poppins, sans-serif",
});

const lazyImport = (fn) => {
  const Component = lazy(fn);
  return (
    <Suspense fallback={<PageSpinner />}>
      <Component />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: lazyImport(() => import("./components/Layout/Layout")),
    errorElement: lazyImport(() => import("./pages/Error/Error")),
    loader: homeLoader(queryClient),
    children: [
      {
        index: true,
        element: lazyImport(() => import("./pages/Homepage")),
      },
      {
        path: "/books/new",
        element: lazyImport(() => import("./pages/NewBook")),
        loader: languagesLoader(queryClient),
      },
      {
        path: "/languages",
        element: lazyImport(() => import("./pages/Languages")),
        loader: languagesLoader(queryClient),
      },
      {
        path: "/terms",
        element: lazyImport(() => import("./pages/Terms")),
        loader: termsLoader(queryClient),
      },
      {
        path: "/terms/term",
        element: lazyImport(() => import("./pages/Term")),
        loader: termsLoader(queryClient),
      },
      {
        path: "/terms/tags",
        element: lazyImport(() => import("./pages/Tags")),
        loader: termsLoader(queryClient),
      },
      {
        path: "/settings/",
        element: lazyImport(() => import("./pages/Settings")),
        loader: settingsLoader(queryClient),
      },
      {
        path: "/backups",
        element: lazyImport(() => import("./pages/Backups")),
        loader: backupsLoader(queryClient),
      },
      {
        path: "/settings/shortcuts",
        element: lazyImport(() => import("./pages/Shortcuts")),
        loader: shortcutsLoader(queryClient),
      },
      {
        path: "/stats",
        element: lazyImport(() => import("./pages/Statistics")),
      },
    ],
  },
  {
    path: "/books/:id/pages/:page",
    element: lazyImport(() => import("./pages/Book")),
    loader: bookLoader(queryClient),
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <MantineProvider theme={theme}>
        <Notifications />
        <NavigationProgress />
        <ModalsProvider modals={{ about: SoftwareInfo }}>
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
