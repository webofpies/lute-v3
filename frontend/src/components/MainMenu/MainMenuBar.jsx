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

function MainMenuBar({ backupData, settings }) {
  const [opened, { toggle }] = useDisclosure(false);
  const createBackupMenu = backupData?.enabled && backupData?.directory != "";

  return (
    <header className={classes.header}>
      <Group wrap="nowrap">
        <HomeImageLink size={rem(54)} />
        <h1 className={classes.heading}>Lute</h1>
      </Group>
      <Group component="nav" gap={5} visibleFrom="sm" wrap="nowrap" ml="auto">
        <NavLink to={menu.home.action} className={classes.link}>
          {menu.home.label}
        </NavLink>

        <NavLink to={menu.book.action} className={classes.link}>
          {menu.book.label}
        </NavLink>

        <NavLink to={menu.languages.action} className={classes.link}>
          {menu.languages.label}
        </NavLink>

        <MenuSection label={menu.terms.label}>
          <Menu.Item component={NavLink} to={menu.terms.all.action}>
            {menu.terms.all.label}
          </Menu.Item>
          <Menu.Item component={NavLink} to={menu.terms.new.action}>
            {menu.terms.new.label}
          </Menu.Item>
          <Menu.Item component={NavLink} to={menu.terms.tags.action}>
            {menu.terms.tags.label}
          </Menu.Item>
        </MenuSection>

        <MenuSection label={menu.settings.label}>
          <Menu.Item component={NavLink} to={menu.settings.general.action}>
            {menu.settings.general.label}
          </Menu.Item>
          <Menu.Item component={NavLink} to={menu.settings.shortcuts.action}>
            {menu.settings.shortcuts.label}
          </Menu.Item>
        </MenuSection>

        {createBackupMenu && (
          <MenuSection label={menu.backup.label}>
            {backupData.lastDate && (
              <>
                <div className={classes.backup}>
                  {backupData.timeSince && (
                    <p>{`Last backup was ${backupData.timeSince}`}</p>
                  )}
                  <p>{backupData.lastDate}</p>
                </div>
                <Menu.Label>
                  <Divider />
                </Menu.Label>
              </>
            )}
            <Menu.Item component={NavLink} to={menu.backup.backups.action}>
              {menu.backup.backups.label}
            </Menu.Item>
            <Menu.Item component={NavLink} to={menu.backup.new.action}>
              {menu.backup.new.label}
            </Menu.Item>
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
