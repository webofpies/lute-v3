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

const CreateBook = lazy(() => import("./pages/CreateBook"));
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
            <CreateBook />
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
      <MantineProvider theme={theme}>
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
