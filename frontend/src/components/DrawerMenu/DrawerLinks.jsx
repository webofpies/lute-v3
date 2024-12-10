import { memo, useState } from "react";
import { Link } from "react-router-dom";
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
import { openSoftwareInfoModal } from "../../misc/modals";
import classes from "./DrawerMenu.module.css";

function DrawerLinks() {
  return (
    <nav className={classes.linksInner}>
      <ul>
        <UnstyledButton
          component={Link}
          to={menu.home.action}
          className={classes.control}>
          <Section label={menu.home.label} icon={menu.home.icon} />
        </UnstyledButton>

        <CollapsingMenu section={menu.books}>{booksLinks}</CollapsingMenu>

        <UnstyledButton
          component={Link}
          to={menu.languages.action}
          className={classes.control}>
          <Section label={menu.languages.label} icon={menu.languages.icon} />
        </UnstyledButton>

        <UnstyledButton
          component={Link}
          to={menu.terms.action}
          className={classes.control}>
          <Section label={menu.terms.label} icon={menu.terms.icon} />
        </UnstyledButton>

        <CollapsingMenu section={menu.backup}>{backupsLinks}</CollapsingMenu>

        <CollapsingMenu section={menu.settings}>{settingsLinks}</CollapsingMenu>

        <CollapsingMenu section={menu.about}>{aboutLinks}</CollapsingMenu>
      </ul>
    </nav>
  );
}

const booksLinks = (
  <>
    <Link className={classes.link} to={menu.books.new.action}>
      {menu.books.new.label}
    </Link>
    <Link className={classes.link} to={menu.books.archived.action}>
      {menu.books.archived.label}
    </Link>
  </>
);

const settingsLinks = (
  <>
    <Link className={classes.link} to={menu.settings.general.action}>
      {menu.settings.general.label}
    </Link>
    <Link className={classes.link} to={menu.settings.shortcuts.action}>
      {menu.settings.shortcuts.label}
    </Link>
  </>
);

const backupsLinks = (
  <>
    <Link className={classes.link} to={menu.backup.backups.action}>
      {menu.backup.backups.label}
    </Link>
    <Link className={classes.link} to={menu.backup.new.action}>
      {menu.backup.new.label}
    </Link>
  </>
);

const aboutLinks = (
  <>
    <UnstyledButton className={classes.link} onClick={openSoftwareInfoModal}>
      {menu.about.info.label}
    </UnstyledButton>
    <Link className={classes.link} to={menu.about.stats.action}>
      {menu.about.stats.label}
    </Link>
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
      <Collapse in={opened}>{children}</Collapse>
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
