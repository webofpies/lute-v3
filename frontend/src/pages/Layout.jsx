import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { nprogress } from "@mantine/nprogress";
import MainMenuBar from "../components/MainMenu/MainMenuBar";
import DemoNotice from "../components/DemoNotice/DemoNotice";
import { settingsQuery } from "../queries/settings";

export default function Layout() {
  const { pathname } = useLocation();
  const [noticeClosed, setNoticeClosed] = useState(false);

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
      {!noticeClosed && pathname === "/" && (
        <DemoNotice onSetClosed={() => setNoticeClosed(true)} />
      )}
      <MainMenuBar backupData={query.data} settings={settings} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
