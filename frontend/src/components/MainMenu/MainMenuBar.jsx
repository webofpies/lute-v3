import { NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  Group,
  Burger,
  Container,
  rem,
  UnstyledButton,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import HomeImageLink from "../HomeImageLink/HomeImageLink";
import { openSoftwareInfoModal } from "../../misc/modals";
import { menu } from "../../misc/menus";
import classes from "./MainMenuBar.module.css";
import { IconChevronDown } from "@tabler/icons-react";

function MainMenuBar() {
  const [opened, { toggle }] = useDisclosure(false);
  const { pathname } = useLocation();

  const pathNames = {
    "/": "Lute",
    "/books/new": "New Book",
    "/books/archived": "Archive",

    "/terms": "Terms",
    "/terms/import": "Import Terms",
    "/terms/tags": "Term Tags",

    "/languages": "Languages",
    "/settings": "Settings",
    "/settings/shortcuts": "Shortcuts",

    "/backup/index": "Backups",

    "/stats": "Statistics",
  };

  return (
    <header className={classes.header}>
      <Container size="xl">
        <div className={classes.inner}>
          <Group wrap="nowrap">
            <HomeImageLink size={rem(54)} />
            <h1 className={classes.heading}>{pathNames[pathname]}</h1>
          </Group>
          <Group gap={5} visibleFrom="sm" wrap="nowrap">
            <NavLink to={menu.home.action} className={classes.link}>
              {menu.home.label}
            </NavLink>

            <MenuSection label={menu.books.label}>
              <Menu.Item component={NavLink} to={menu.books.new.action}>
                {menu.books.new.label}
              </Menu.Item>
              <Menu.Item component={NavLink} to={menu.books.archived.action}>
                {menu.books.archived.label}
              </Menu.Item>
            </MenuSection>

            <NavLink to={menu.languages.action} className={classes.link}>
              {menu.languages.label}
            </NavLink>

            <NavLink to={menu.terms.action} className={classes.link}>
              {menu.terms.label}
            </NavLink>

            <MenuSection label={menu.settings.label}>
              <Menu.Item component={NavLink} to={menu.settings.general.action}>
                {menu.settings.general.label}
              </Menu.Item>
              <Menu.Item
                component={NavLink}
                to={menu.settings.shortcuts.action}>
                {menu.settings.shortcuts.label}
              </Menu.Item>
            </MenuSection>

            <MenuSection label={menu.backup.label}>
              <Menu.Item component={NavLink} to={menu.backup.backups.action}>
                {menu.backup.backups.label}
              </Menu.Item>
              <Menu.Item component={NavLink} to={menu.backup.new.action}>
                {menu.backup.new.label}
              </Menu.Item>
            </MenuSection>

            <MenuSection label={menu.about.label}>
              <Menu.Item onClick={openSoftwareInfoModal}>
                {menu.about.info.label}
              </Menu.Item>
              <Menu.Item component={NavLink} to={menu.about.stats.action}>
                {menu.about.stats.label}
              </Menu.Item>
              <Menu.Item
                component="a"
                href={menu.about.docs.action}
                target="_blank">
                {menu.about.docs.label}
              </Menu.Item>
              <Menu.Item
                component="a"
                href={menu.about.discord.action}
                target="_blank">
                {menu.about.discord.label}
              </Menu.Item>
            </MenuSection>
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}

function MenuSection({ label, children }) {
  return (
    <Menu
      // for active style selectors to work: keepMounted and not withinPortal
      keepMounted
      withinPortal={false}
      trigger="hover"
      offset={0}
      openDelay={20}
      closeDelay={20}
      transitionProps={{ exitDuration: 0 }}>
      <Menu.Target>
        <UnstyledButton
          className={classes.link}
          onClick={(event) => event.preventDefault()}>
          <Center>
            <span className={classes.linkLabel}>{label}</span>
            <IconChevronDown size="0.9rem" stroke={1.5} />
          </Center>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{children}</Menu.Dropdown>
    </Menu>
  );
}

export default MainMenuBar;
