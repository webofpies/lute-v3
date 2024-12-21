import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import MainMenuBar from "../components/MainMenu/MainMenuBar";
import { settingsQuery } from "../queries/settings";

export default function Layout() {
  const query = useQuery({
    queryKey: ["backup"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/api/backup");
      return await res.json();
    },
  });

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
