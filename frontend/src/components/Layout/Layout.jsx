import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useNavigation } from "react-router-dom";
import { nprogress } from "@mantine/nprogress";
import MainMenuBar from "../MainMenu/MainMenuBar";
import { settingsQuery } from "@settings/api/settings";

function Layout() {
  const { data: settings } = useQuery(settingsQuery);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  }, [navigation.state]);

  return (
    <>
      <MainMenuBar settings={settings} />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
