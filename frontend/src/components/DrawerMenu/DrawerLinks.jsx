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
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./DrawerMenu.module.css";

function DrawerLinks({ icon: Icon, label, initiallyOpened, links }) {
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

  const itemContent = (
    <Group justify="space-between" gap={0}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <ThemeIcon size={30}>
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
  );

  return (
    <>
      {hasLinks ? (
        <>
          <UnstyledButton
            onClick={() => setOpened((o) => !o)}
            className={classes.control}>
            {itemContent}
          </UnstyledButton>
          <Collapse in={opened}>{items}</Collapse>
        </>
      ) : (
        <UnstyledButton
          component={Link}
          to={links}
          onClick={() => setOpened((o) => !o)}
          className={classes.control}>
          {itemContent}
        </UnstyledButton>
      )}
    </>
  );
}

export default memo(DrawerLinks);
