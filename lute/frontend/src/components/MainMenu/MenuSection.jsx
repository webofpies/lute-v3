import { Center, Menu, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import classes from "./MainMenuBar.module.css";

function MenuSection({ label, children }) {
  return (
    <Menu
      trigger="hover"
      offset={0}
      openDelay={20}
      closeDelay={20}
      transitionProps={{ exitDuration: 0 }}
      withinPortal>
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

export default MenuSection;
