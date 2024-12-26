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
import "./index.css";
import "./highlight.css";

import Layout from "./pages/Layout";
import Homepage from "./pages/Homepage";
import SoftwareInfo from "./components/Modals/SoftwareInfo";
import Error from "./components/Error/Error";
import PageSpinner from "./components/PageSpinner/PageSpinner";

import { loader as bookLoader } from "./queries/book";
import { loader as languagesLoader } from "./queries/language";
import { loader as settingsLoader } from "./queries/settings";
import { loader as termsLoader } from "./queries/term";

const queryClient = new QueryClient();

const NewBook = lazy(() => import("./pages/NewBook"));
const Languages = lazy(() => import("./pages/Languages"));
const Shortcuts = lazy(() => import("./pages/Shortcuts"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Settings = lazy(() => import("./pages/Settings"));
const NewTerm = lazy(() => import("./pages/NewTerm"));
const BookView = lazy(() => import("./components/BookView/BookView"));

const theme = createTheme({
  fontFamily: "Rubik, sans-serif",
  bar: "calc(0% * var(--slider-size))",
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    loader: settingsLoader(queryClient),
    children: [
      { index: true, element: <Homepage /> },
      {
        path: "/books/new",
        element: (
          <Suspense fallback={<PageSpinner />}>
            <NewBook />
          </Suspense>
        ),
        loader: languagesLoader(queryClient),
      },
      {
        path: "/languages",
        element: (
          <Suspense fallback={<PageSpinner />}>
            <Languages />
          </Suspense>
        ),
        loader: languagesLoader(queryClient),
      },
      {
        path: "/terms/new",
        element: (
          <Suspense fallback={<PageSpinner />}>
            <NewTerm />
          </Suspense>
        ),
        loader: termsLoader(queryClient),
      },
      {
        path: "/settings/",
        element: (
          <Suspense fallback={<PageSpinner />}>
            <Settings />
          </Suspense>
        ),
        loader: settingsLoader(queryClient),
      },
      {
        path: "/settings/shortcuts",
        element: (
          <Suspense fallback={<PageSpinner />}>
            <Shortcuts />
          </Suspense>
        ),
      },
      {
        path: "/stats",
        element: (
          <Suspense fallback={<PageSpinner />}>
            <Statistics />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/books/:id/pages/:page",
    element: (
      <Suspense fallback={<PageSpinner />}>
        <BookView />
      </Suspense>
    ),
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
