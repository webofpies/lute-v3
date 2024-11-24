import { memo } from "react";
import { Drawer } from "@mantine/core";
import DrawerMenuContent from "./DrawerMenuContent";
import classes from "./DrawerMenu.module.css";

function DrawerMenu({ opened, close }) {
  return (
    <Drawer.Root
      classNames={{ content: classes.drawer }}
      opened={opened}
      onClose={close}
      size="250"
      transitionProps={{
        duration: 100,
        timingFunction: "cubic-bezier(0.77,0.2,0.05,1.0)",
        transition: "slide-right",
      }}>
      <Drawer.Overlay />
      <Drawer.Content>
        <DrawerMenuContent />
      </Drawer.Content>
    </Drawer.Root>
  );
}

export default memo(DrawerMenu);
