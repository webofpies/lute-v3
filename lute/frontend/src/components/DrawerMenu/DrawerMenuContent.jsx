/* eslint-disable react/prop-types */
import {
  Box,
  Center,
  Code,
  Collapse,
  Drawer,
  Group,
  rem,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import DrawerButtonGrp from "./DrawerButtonGrp";
import classes from "./DrawerMenu.module.css";
import {
  IconBaselineDensityMedium,
  IconBaselineDensitySmall,
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconTextDecrease,
  IconTextIncrease,
  IconViewportNarrow,
  IconViewportWide,
  IconAdjustments,
  IconCalendarStats,
  IconNotes,
  IconPresentationAnalytics,
  IconChevronRight,
} from "@tabler/icons-react";
import { memo, useState } from "react";
import { Link } from "react-router-dom";

const linkData = [
  {
    label: "Edit",
    icon: IconNotes,
    // initiallyOpened: true,
    links: [
      { label: "Edit Current Page", link: "/" },
      { label: "Add Page After", link: "/" },
      { label: "Add Page Before", link: "/" },
      { label: "Delete Current Page", link: "/" },
    ],
  },
  {
    label: "Bookmarks",
    icon: IconCalendarStats,
    links: [
      { label: "List", link: "/" },
      { label: "Add Bookmark", link: "/" },
    ],
  },
  {
    label: "Translate Sentence",
    link: "/",
    icon: IconPresentationAnalytics,
  },
  {
    label: "Translate Page",
    link: "/",
    icon: IconPresentationAnalytics,
  },
  {
    label: "Next Theme (m)",
    link: "/",
    icon: IconAdjustments,
  },
  {
    label: "Toggle Highlights (h)",
    link: "/",
    icon: IconAdjustments,
  },
  {
    label: "Keyboard Shortcuts",
    link: "/",
    icon: IconAdjustments,
  },
  // TODO add screen interactions ass radio buttons
];

function DrawerMenuContent() {
  const links = linkData.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));
  return (
    <>
      <Drawer.Header>
        <Group justify="space-between" align="center">
          <Text>Lute</Text>
          <Code fw={700}>v3.5.2</Code>
        </Group>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <ScrollArea className={classes.links}>
          <Center>
            <Stack>
              <Group>
                <DrawerButtonGrp
                  tooltip={"Adjust font size"}
                  icons={[IconTextDecrease, IconTextIncrease]}
                />
                <DrawerButtonGrp
                  tooltip={"Adjust line height"}
                  icons={[IconBaselineDensityMedium, IconBaselineDensitySmall]}
                />
              </Group>
              <Group>
                <DrawerButtonGrp
                  tooltip={"Adjust content width"}
                  icons={[IconViewportNarrow, IconViewportWide]}
                />
                <DrawerButtonGrp
                  tooltip={"Change column count"}
                  icons={[IconCaretLeftFilled, IconCaretRightFilled]}
                />
              </Group>
            </Stack>
          </Center>
          <ul className={classes.linksInner}>{links}</ul>
        </ScrollArea>
      </Drawer.Body>
    </>
  );
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links }) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <Link
      className={classes.link}
      to={link.link}
      key={link.label}
      onClick={(event) => event.preventDefault()}>
      {link.label}
    </Link>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? "rotate(-90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

export default memo(DrawerMenuContent);
