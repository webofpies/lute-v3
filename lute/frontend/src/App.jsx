import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";
import { lazy, Suspense } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./pages/Layout";
import Homepage from "./pages/Homepage";

const ReadPane = lazy(() => import("./components/ReadPane/ReadPane"));
const Shortcuts = lazy(() => import("./pages/Shortcuts"));

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
    ],
  },
  {
    path: "/read/:id",
    element: (
      <Suspense>
        <ReadPane />
      </Suspense>
    ),
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <MantineProvider theme={theme}>
        <Notifications />
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
