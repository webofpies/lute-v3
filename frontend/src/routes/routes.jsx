import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import homeLoader from "../initial-loader";
import bookLoader from "@book/api/loader";
import languagesLoader from "@language/api/loader";
import termsLoader from "@term/api/loader";
import settingsLoader from "@settings/api/loaders/general";
import shortcutsLoader from "@settings/api/loaders/shortcuts";
import backupsLoader from "@backup/api/loader";
import PageSpinner from "@common/PageSpinner/PageSpinner";

const routes = (queryClient) =>
  createBrowserRouter([
    {
      path: "/",
      element: lazyImport(() => import("../components/Layout/Layout")),
      errorElement: lazyImport(() => import("../pages/ErrorPage/ErrorPage")),
      loader: homeLoader(queryClient),
      children: [
        {
          index: true,
          element: lazyImport(() => import("../pages/HomePage")),
        },
        {
          path: "/books/new",
          element: lazyImport(() => import("../pages/NewBookPage")),
          loader: languagesLoader(queryClient),
        },
        {
          path: "/languages",
          element: lazyImport(() => import("../pages/LanguagesPage")),
          loader: languagesLoader(queryClient),
        },
        {
          path: "/terms",
          element: lazyImport(() => import("../pages/TermsPage")),
          loader: termsLoader(queryClient),
        },
        {
          path: "/terms/term",
          element: lazyImport(() => import("../pages/NewEditTermPage")),
          loader: termsLoader(queryClient),
        },
        {
          path: "/terms/tags",
          element: lazyImport(() => import("../pages/TagsPage")),
          loader: termsLoader(queryClient),
        },
        {
          path: "/settings/",
          element: lazyImport(() => import("../pages/SettingsPage")),
          loader: settingsLoader(queryClient),
        },
        {
          path: "/backups",
          element: lazyImport(() => import("../pages/BackupsPage")),
          loader: backupsLoader(queryClient),
        },
        {
          path: "/settings/shortcuts",
          element: lazyImport(() => import("../pages/ShortcutsPage")),
          loader: shortcutsLoader(queryClient),
        },
        {
          path: "/stats",
          element: lazyImport(() => import("../pages/StatisticsPage")),
        },
      ],
    },
    {
      path: "/books/:id/pages/:page",
      element: lazyImport(() => import("../pages/BookPage")),
      loader: bookLoader(queryClient),
    },
  ]);

const lazyImport = (fn) => {
  const Component = lazy(fn);
  return (
    <Suspense fallback={<PageSpinner />}>
      <Component />
    </Suspense>
  );
};

export default routes;
