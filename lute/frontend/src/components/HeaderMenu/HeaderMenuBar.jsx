import { Menu, Group, Burger, Container, Image, MenuItem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderMenuBar.module.css";
import HeaderMenu from "./HeaderMenu";
import { NavLink } from "react-router-dom";

export default function HeaderMenuBar({ openVersionModal }) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <header className={classes.header}>
      <Container size="xl">
        <div className={classes.inner}>
          <Group>
            <Image w="auto" h="3rem" src="/images/logo.png" />
            <h1>Lute</h1>
          </Group>
          <Group gap={5} visibleFrom="sm">
            <NavLink className={classes.link}>Home</NavLink>
            <HeaderMenu label="Book">
              <Menu.Item>
                <NavLink to="/book/new">Create New Book</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/book/import_webpage">Import Webpage</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/book/archived">Book Archive</NavLink>
              </Menu.Item>
            </HeaderMenu>
            <HeaderMenu label="Terms">
              <Menu.Item>
                <NavLink to="/term/index">Terms</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/termimport/index">Import Terms</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/termtag/index">Term Tags</NavLink>
              </Menu.Item>
            </HeaderMenu>
            <HeaderMenu label="Settings">
              <Menu.Item>
                <NavLink to="/language/index">Languages</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/settings/index">Settings</NavLink>
              </Menu.Item>
            </HeaderMenu>
            <HeaderMenu label="Backup">
              <Menu.Item>
                <NavLink to="/backup/index">Backups</NavLink>
              </Menu.Item>
              <Menu.Item>
                <NavLink to="/backup/backup?type=manual">Create Backup</NavLink>
              </Menu.Item>
            </HeaderMenu>
            <HeaderMenu label="About">
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
            </HeaderMenu>
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}
