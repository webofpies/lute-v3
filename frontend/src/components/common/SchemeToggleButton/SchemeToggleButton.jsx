import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { applyLuteHighlights } from "@actions/general";

function SchemeToggleButton({ colors, onCloseDrawer = null }) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  const Icon = colorScheme === "dark" ? IconSun : IconMoon;

  function handleToggleScheme() {
    const newScheme = computedColorScheme === "dark" ? "light" : "dark";
    setColorScheme(newScheme);
    applyLuteHighlights(colors.status, newScheme);
    applyLuteHighlights(colors.general, newScheme);
  }

  return (
    <ActionIcon
      variant="subtle"
      size="lg"
      onClick={() => {
        handleToggleScheme();
        onCloseDrawer && onCloseDrawer();
      }}>
      <Icon size="90%" />
    </ActionIcon>
  );
}

export default SchemeToggleButton;
