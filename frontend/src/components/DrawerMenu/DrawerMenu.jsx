import { memo } from "react";
import { Link } from "react-router-dom";
import { Divider, Drawer, Group, Image, ScrollArea, Text } from "@mantine/core";
import DrawerLinks from "./DrawerLinks";
import DrawerFooter from "./DrawerFooter";
import classes from "./DrawerMenu.module.css";
import { navLinks } from "../../misc/menus";

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
        <Drawer.Header>
          <Group justify="space-between" align="center">
            <Link to="/">
              <Image w="auto" h="2rem" src="/images/logo.png" />
            </Link>
            <Text>Lute 3</Text>
          </Group>
          <Drawer.CloseButton />
        </Drawer.Header>

        <Divider />

        <Drawer.Body p={0} className={classes.drawer}>
          <ScrollArea className={classes.scroll}>
            <nav className={classes.linksInner}>
              <ul>
                {navLinks.map((item) => (
                  <DrawerLinks {...item} key={item.label} />
                ))}
              </ul>
            </nav>
          </ScrollArea>

          <Divider />

          <DrawerFooter />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}

export default memo(DrawerMenu);
