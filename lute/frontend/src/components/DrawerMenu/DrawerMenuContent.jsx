/* eslint-disable react/prop-types */
import {
  ActionIcon,
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
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
// import DrawerButtonGrp from "./DrawerButtonGrp";
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
import {
  adjustFontSize,
  adjustLineHeight,
  setColumnCount,
} from "../../misc/textOptions";

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
                <Tooltip label="Adjust font size">
                  <ActionIcon.Group>
                    <ActionIcon
                      onClick={() => adjustFontSize(-1)}
                      variant="light"
                      size="lg">
                      <IconTextDecrease
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => adjustFontSize(1)}
                      variant="light"
                      size="lg">
                      <IconTextIncrease
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </ActionIcon.Group>
                </Tooltip>
                <Tooltip label="Adjust line height">
                  <ActionIcon.Group>
                    <ActionIcon
                      onClick={() => adjustLineHeight(-0.1)}
                      variant="light"
                      size="lg">
                      <IconBaselineDensityMedium
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => adjustLineHeight(0.1)}
                      variant="light"
                      size="lg">
                      <IconBaselineDensitySmall
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </ActionIcon.Group>
                </Tooltip>
              </Group>
              <Group>
                <Tooltip label="Adjust content width">
                  <ActionIcon.Group>
                    <ActionIcon variant="light" size="lg">
                      <IconViewportNarrow
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                    <ActionIcon variant="light" size="lg">
                      <IconViewportWide
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </ActionIcon.Group>
                </Tooltip>
                <Tooltip label="Change column count">
                  <ActionIcon.Group>
                    <ActionIcon
                      onClick={() => setColumnCount(1)}
                      variant="light"
                      size="lg">
                      <IconCaretLeftFilled
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => setColumnCount(2)}
                      variant="light"
                      size="lg">
                      <IconCaretRightFilled
                        style={{ width: "70%", height: "70%" }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  </ActionIcon.Group>
                </Tooltip>
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
