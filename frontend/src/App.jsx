import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Center, createTheme, Loader, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "./index.css";

import Layout from "./pages/Layout";
import Homepage from "./pages/Homepage";
import BookView from "./components/BookView/BookView";
import { UserSettingsProvider } from "./context/UserSettingsContext";
import { loader as bookLoader } from "./queries/book";
import { loader as languagesLoader } from "./queries/language";

const queryClient = new QueryClient();

const NewBook = lazy(() => import("./pages/NewBook"));
const Languages = lazy(() => import("./pages/Languages"));
const Shortcuts = lazy(() => import("./pages/Shortcuts"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Settings = lazy(() => import("./pages/Settings"));

const pageSpinner = (
  <Center>
    <Loader />
  </Center>
);

const theme = createTheme({
  fontFamily: "Rubik, sans-serif",
  bar: "calc(0% * var(--slider-size))",

  lute: {
    colors: {
      status: {
        0: "#d5ffff", // 0
        1: "#f5b8a9", // 1
        2: "#f5cca9", // 2
        3: "#f5e1a9", // 3
        4: "#f5f3a9", // 4
        5: "#ddffdd", // 5
        98: "#ee8577", // Ignored (98)
        99: "#72da88", // Well known (99)
      },
      kwordmarked: "#f56767",
      wordhover: "#228be6",
      multiterm: "#ffe066",
      flash: "#ff6868",
    },
  },
});

const cssVarsResolver = (theme) => ({
  variables: {
    "--lute-color-status-0": theme.lute.colors.status[0],
    "--lute-color-status-1": theme.lute.colors.status[1],
    "--lute-color-status-2": theme.lute.colors.status[2],
    "--lute-color-status-3": theme.lute.colors.status[3],
    "--lute-color-status-4": theme.lute.colors.status[4],
    "--lute-color-status-5": theme.lute.colors.status[5],
    "--lute-color-status-98": theme.lute.colors.status[98],
    "--lute-color-status-99": theme.lute.colors.status[99],

    "--lute-color-wordhover": theme.lute.colors.wordhover,
    "--lute-color-kwordmarked": theme.lute.colors.kwordmarked,
    "--lute-color-multiterm": theme.lute.colors.multiterm,
    "--lute-color-flash": theme.lute.colors.flash,
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Homepage /> },
      {
        path: "/books/new",
        element: (
          <Suspense fallback={pageSpinner}>
            <NewBook />
          </Suspense>
        ),
        loader: languagesLoader(queryClient),
      },
      {
        path: "/languages",
        element: (
          <Suspense fallback={pageSpinner}>
            <Languages />
          </Suspense>
        ),
        loader: languagesLoader(queryClient),
      },
      {
        path: "/settings/shortcuts",
        element: (
          <Suspense fallback={pageSpinner}>
            <Shortcuts />
          </Suspense>
        ),
      },
      {
        path: "/settings/",
        element: (
          <Suspense fallback={pageSpinner}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "/stats",
        element: (
          <Suspense fallback={pageSpinner}>
            <Statistics />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/books/:id/pages/:page",
    element: <BookView />,
    loader: bookLoader(queryClient),
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <MantineProvider theme={theme} cssVariablesResolver={cssVarsResolver}>
        <Notifications />
        <NavigationProgress />
        <UserSettingsProvider>
          <RouterProvider router={router} />
        </UserSettingsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
