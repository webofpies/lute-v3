import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useNavigation } from "react-router-dom";
import { nprogress } from "@mantine/nprogress";
import MainMenuBar from "../components/MainMenu/MainMenuBar";
import { backupQuery, settingsQuery } from "../queries/settings";

export default function Layout() {
  const { data: backup } = useQuery(backupQuery);
  const { data: settings } = useQuery(settingsQuery);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  }, [navigation.state]);

  return (
    <>
      <MainMenuBar backupData={backup} settings={settings} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
