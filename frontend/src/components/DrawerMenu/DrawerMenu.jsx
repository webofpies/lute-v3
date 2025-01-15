import { memo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  Box,
  Center,
  Divider,
  Drawer,
  Group,
  Image,
  ScrollArea,
  SegmentedControl,
  Text,
} from "@mantine/core";
import {
  IconCircleLetterAFilled,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconPalette,
} from "@tabler/icons-react";
import DrawerLinks from "./DrawerLinks";
import SchemeToggleButton from "../SchemeToggleButton/SchemeToggleButton";
import { settingsQuery } from "../../queries/settings";
import classes from "./DrawerMenu.module.css";

function DrawerMenu({ drawerOpen, onClose, onThemeFormOpen }) {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <Drawer.Root
      classNames={{ content: classes.drawer }}
      opened={drawerOpen}
      onClose={onClose}
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
          <Center p={10}>
            <Group gap={5}>
              <SchemeToggleButton
                colors={settings.highlights}
                onCloseDrawer={onClose}
              />
              <ActionIcon
                onClick={() => {
                  onThemeFormOpen((v) => !v);
                  onClose();
                }}
                size="lg"
                variant="subtle">
                <IconPalette size="90%" />
              </ActionIcon>
            </Group>
          </Center>

          <Divider />

          <ScrollArea className={classes.scroll}>
            <DrawerLinks />
          </ScrollArea>

          <Divider />

          <DrawerFooter />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}

function DrawerFooter() {
  return (
    <Box className={classes.footer}>
      <SegmentedControl
        fullWidth
        styles={{
          label: { padding: "0.2rem" },
          innerLabel: { lineHeight: 0, display: "block" },
        }}
        size="xs"
        withItemsBorders
        color="blue"
        data={[
          {
            value: "desktop",
            label: <IconDeviceDesktop />,
          },
          { value: "mobile", label: <IconDeviceMobile /> },
          {
            value: "auto",
            label: <IconCircleLetterAFilled />,
          },
        ]}
      />
    </Box>
  );
}

export default memo(DrawerMenu);
