import { useQuery } from "@tanstack/react-query";
import { Outlet, useNavigation } from "react-router-dom";
import MainMenuBar from "../components/MainMenu/MainMenuBar";
import { settingsQuery } from "../queries/settings";
import { useEffect } from "react";
import { nprogress } from "@mantine/nprogress";

export default function Layout() {
  const query = useQuery({
    queryKey: ["backup"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/api/backup");
      return await res.json();
    },
  });

  const navigation = useNavigation();
  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  }, [navigation.state]);

  const { data: settings } = useQuery(settingsQuery());

  return (
    <>
      <MainMenuBar backupData={query.data} settings={settings} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
