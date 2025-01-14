import { NavLink } from "react-router-dom";
import { modals } from "@mantine/modals";
import {
  Menu,
  Group,
  Burger,
  rem,
  UnstyledButton,
  Center,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { softwareInfo } from "../../misc/modals";
import { menu } from "../../misc/menus";
import HomeImageLink from "../HomeImageLink/HomeImageLink";
import SchemeToggleButton from "../SchemeToggleButton/SchemeToggleButton";
import classes from "./MainMenuBar.module.css";

function MainMenuBar({ settings }) {
  const [opened, { toggle }] = useDisclosure(false);
  const createBackupMenu =
    settings.backup.enabled && settings.backup.directory != "";

  return (
    <header className={classes.header}>
      <Group wrap="nowrap">
        <HomeImageLink size={rem(54)} />
        <h1 className={classes.heading}>Lute</h1>
      </Group>
      <Group component="nav" gap={5} visibleFrom="sm" wrap="nowrap" ml="auto">
        {[menu.home, menu.book, menu.languages].map((menu) => (
          <NavLink key={menu.label} to={menu.action} className={classes.link}>
            {menu.label}
          </NavLink>
        ))}

        <MenuSection label={menu.terms.label}>
          {menu.terms.children.map((child) => makeLink(child))}
        </MenuSection>

        <MenuSection label={menu.settings.label}>
          {menu.settings.children.map((child) => makeLink(child))}
        </MenuSection>

        {createBackupMenu && (
          <MenuSection label={menu.backup.label}>
            {settings.backup.lastDate && (
              <>
                <div className={classes.backup}>
                  {settings.backup.timeSince && (
                    <p>{`Last backup was ${settings.backup.timeSince}`}</p>
                  )}
                  <p>{settings.backup.lastDate}</p>
                </div>
                <Menu.Label>
                  <Divider />
                </Menu.Label>
              </>
            )}
            {menu.backup.children.map((child) => makeLink(child))}
          </MenuSection>
        )}

        <MenuSection label={menu.about.label}>
          <Menu.Item onClick={() => modals.openContextModal(softwareInfo)}>
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
      <SchemeToggleButton colors={settings.highlights} />
      <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
    </header>
  );
}

const makeLink = (child) => (
  <Menu.Item key={child.label} component={NavLink} to={child.action}>
    {child.label}
  </Menu.Item>
);

function MenuSection({ label, children }) {
  return (
    <Menu
      // for active style selectors to work: keepMounted and outside withinPortal
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
