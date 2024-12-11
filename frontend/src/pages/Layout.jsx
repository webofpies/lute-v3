import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import MainMenuBar from "../components/MainMenu/MainMenuBar";

export default function Layout() {
  const query = useQuery({
    queryKey: ["backup"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/api/backup");
      return await res.json();
    },
    staleTime: Infinity,
  });

  return (
    <>
      <MainMenuBar backupData={query.data} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
