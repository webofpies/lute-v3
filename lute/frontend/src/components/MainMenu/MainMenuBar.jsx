import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Group, Burger, Container, Image, MenuItem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./MainMenuBar.module.css";
import MenuSection from "./MenuSection";

export default function HeaderMenuBar({ openVersionModal }) {
  const [opened, { toggle }] = useDisclosure(false);
  const { pathname } = useLocation();

  const pathNames = {
    "/": "Lute",
    "/book/new": "Create New Book",
    "/book/import_webpage": "Import Webpage",
    "/book/archived": "Book Archive",

    "/term/index": "Terms",
    "/termimport/index": "Import Terms",
    "/termtag/index": "Term Tags",

    "/language/index": "Languages",
    "/settings/index": "Settings",
    "/settings/shortcuts": "Shortcuts",

    "/backup/index": "Backups",

    "/stats": "Statistics",
  };

  return (
    <header className={classes.header}>
      <Container size="xl">
        <div className={classes.inner}>
          <Group>
            <Link to="/">
              <Image w="auto" h="3rem" src="/images/logo.png" />
            </Link>
            <h1>{pathNames[pathname]}</h1>
          </Group>
          <Group gap={5} visibleFrom="sm">
            <NavLink to="/" className={classes.link}>
              Home
            </NavLink>
            <MenuSection label="Book">
              <Menu.Item>
                <NavLink to="/book/new">Create New Book</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/book/import_webpage">Import Webpage</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/book/archived">Book Archive</NavLink>
              </Menu.Item>
            </MenuSection>
            <MenuSection label="Terms">
              <Menu.Item>
                <NavLink to="/term/index">Terms</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/termimport/index">Import Terms</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/termtag/index">Term Tags</NavLink>
              </Menu.Item>
            </MenuSection>
            <MenuSection label="Settings">
              <Menu.Item>
                <NavLink to="/language/index">Languages</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/settings/index">Settings</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/settings/shortcuts">Keyboard Shortcuts</NavLink>
              </Menu.Item>
            </MenuSection>
            <MenuSection label="Backup">
              <Menu.Item>
                <NavLink to="/backup/index">Backups</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/backup/backup?type=manual">Create Backup</NavLink>
              </Menu.Item>
            </MenuSection>
            <MenuSection label="About">
              <Menu.Item onClick={openVersionModal}>
                Version and software info
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/stats">Statistics</NavLink>
              </Menu.Item>
              <Menu.Item
                component="a"
                href="https://luteorg.github.io/lute-manual"
                target="_blank">
                Docs
              </Menu.Item>
              <MenuItem
                component="a"
                href="https://discord.gg/CzFUQP5m8u"
                target="_blank">
                Discord
              </MenuItem>
            </MenuSection>
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}
