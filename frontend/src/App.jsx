import { RouterProvider } from "react-router-dom";
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
import routes from "./routes/routes";
import SoftwareInfo from "./components/Modals/SoftwareInfo";

const queryClient = new QueryClient();

const theme = createTheme({
  fontFamily: "Poppins, sans-serif",
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <MantineProvider theme={theme}>
        <Notifications />
        <NavigationProgress />
        <ModalsProvider modals={{ about: SoftwareInfo }}>
          <RouterProvider router={routes(queryClient)} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
