import { Outlet } from "react-router-dom";
import MainMenuBar from "../components/MainMenu/MainMenuBar";

export default function Layout() {
  return (
    <>
      <MainMenuBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
