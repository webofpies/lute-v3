import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mantine/core/styles.css";
import "./index.css";
import Homepage from "./components/Homepage/Homepage";
import { lazy, Suspense } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Shortcuts from "./components/Shortcuts/Shortcuts";

const ReadPane = lazy(() => import("./components/ReadPane/ReadPane"));

const theme = createTheme({
  fontFamily: "Rubik, sans-serif",
  bar: "calc(0% * var(--slider-size))",
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/settings/shortcuts",
    element: <Shortcuts />,
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
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
