import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { modals } from "@mantine/modals";
import {
  Box,
  Collapse,
  Group,
  rem,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { menu } from "../../misc/menus";
import { softwareInfo } from "../../misc/modals";
import classes from "./DrawerMenu.module.css";

function DrawerLinks() {
  return (
    <nav className={classes.nav}>
      <ul>
        {[menu.home, menu.book, menu.languages].map((menu) => (
          <UnstyledButton
            key={menu.label}
            component={Link}
            to={menu.action}
            className={classes.control}>
            <Section label={menu.label} icon={menu.icon} />
          </UnstyledButton>
        ))}

        {[menu.terms, menu.backup, menu.settings].map((menu) => (
          <CollapsingMenu key={menu.label} section={menu} />
        ))}

        <CollapsingMenu section={menu.about}>{aboutMenuItems}</CollapsingMenu>
      </ul>
    </nav>
  );
}

const makeLink = (child) => (
  <Link key={child.label} className={classes.link} to={child.action}>
    {child.label}
  </Link>
);

const aboutMenuItems = (
  <>
    <UnstyledButton
      className={classes.link}
      onClick={() => modals.openContextModal(softwareInfo)}>
      {menu.about.info.label}
    </UnstyledButton>
    {makeLink(menu.about.stats)}
    <a className={classes.link} href={menu.about.docs.action} target="_blank">
      {menu.about.docs.label}
    </a>
    <a
      className={classes.link}
      href={menu.about.discord.action}
      target="_blank">
      {menu.about.discord.label}
    </a>
  </>
);

function CollapsingMenu({ section, children }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}>
        <Section
          label={section.label}
          hasLinks={true}
          opened={opened}
          icon={section.icon}
        />
      </UnstyledButton>
      <Collapse in={opened}>
        {children ?? section.children.map((link) => makeLink(link))}
      </Collapse>
    </>
  );
}

function Section({ label, hasLinks, opened, icon: Icon }) {
  return (
    <Group justify="space-between" gap={0}>
      <Group gap={0}>
        <ThemeIcon size={30}>
          <Icon style={{ width: rem(18), height: rem(18) }} />
        </ThemeIcon>
        <Box ml="md">{label}</Box>
      </Group>
      {hasLinks && (
        <IconChevronDown
          className={classes.chevron}
          stroke={1.5}
          style={{
            width: rem(16),
            height: rem(16),
            transform: opened ? "rotate(-180deg)" : "none",
          }}
        />
      )}
    </Group>
  );
}

export default memo(DrawerLinks);
