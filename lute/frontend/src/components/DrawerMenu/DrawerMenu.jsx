/* eslint-disable react/prop-types */
import { Drawer } from "@mantine/core";
import { memo } from "react";
import DrawerMenuContent from "./DrawerMenuContent";

function DrawerMenu({ opened, close }) {
  return (
    <Drawer.Root
      opened={opened}
      onClose={close}
      size="250"
      transitionProps={{
        duration: 200,
        timingFunction: "cubic-bezier(0.77,0.2,0.05,1.0)",
        transition: "slide-right",
      }}>
      <Drawer.Overlay backgroundOpacity={0.5} blur={4} />
      <Drawer.Content>
        <DrawerMenuContent />
      </Drawer.Content>
    </Drawer.Root>
  );
}

export default memo(DrawerMenu);
