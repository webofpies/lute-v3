import { Outlet } from "react-router-dom";
import MainMenuBar from "../components/MainMenu/MainMenuBar";
import AboutModal from "../components/About/AboutModal";
import { useDisclosure } from "@mantine/hooks";

export default function Layout() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <MainMenuBar openVersionModal={open} />
      <AboutModal opened={opened} close={close} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
