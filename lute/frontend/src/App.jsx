import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "./index.css";
import { lazy, Suspense } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./pages/Layout";
import Homepage from "./pages/Homepage";
import { UserSettingsProvider } from "./context/UserSettingsContext";
import ReadPane from "./components/ReadPane/ReadPane";
import { loader as bookLoader } from "./queries/book";

const queryClient = new QueryClient();

const Shortcuts = lazy(() => import("./pages/Shortcuts"));
const Statistics = lazy(() => import("./pages/Statistics"));

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
        path: "/settings/shortcuts",
        element: (
          <Suspense>
            <Shortcuts />
          </Suspense>
        ),
      },
      {
        path: "/stats",
        element: (
          <Suspense>
            <Statistics />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/book/:id/page/:page",
    element: <ReadPane />,
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
