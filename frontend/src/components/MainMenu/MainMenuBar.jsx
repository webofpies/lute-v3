import { NavLink, useLocation } from "react-router-dom";
import { Menu, Group, Burger, Container, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./MainMenuBar.module.css";
import MenuSection from "./MenuSection";
import { navLinks } from "../../misc/menus";
import HomeImageLink from "../HomeImageLink/HomeImageLink";

function MainMenuBar({ openVersionModal }) {
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
          <Group>
            <HomeImageLink size={rem(54)} />
            <h1>{pathNames[pathname]}</h1>
          </Group>
          <Group gap={5} visibleFrom="sm">
            {navLinks.map((item) =>
              Array.isArray(item.links) ? (
                <MenuSection label={item.label} key={item.label}>
                  {item.links.map((sublink) => (
                    <Menu.Item
                      key={sublink.label}
                      component={NavLink}
                      to={sublink.link}>
                      {sublink.label}
                    </Menu.Item>
                  ))}
                </MenuSection>
              ) : (
                <NavLink
                  to={item.links}
                  className={classes.link}
                  key={item.label}>
                  {item.label}
                </NavLink>
              )
            )}
            {/* <MenuSection label="About">
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
            </MenuSection> */}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}

export default MainMenuBar;
