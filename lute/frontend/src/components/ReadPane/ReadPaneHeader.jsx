import { memo } from "react";
import { Link } from "react-router-dom";
import {
  ActionIcon,
  Group,
  Image,
  Paper,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { IconLink, IconMenu2 } from "@tabler/icons-react";
import ReadSlider from "./ReadSlider";
import BookmarksMenu from "./BookmarksMenu";
import styles from "./ReadPane.module.css";

function ReadPaneHeader({ open, pageNum, book }) {
  return (
    <Paper radius={0} shadow="sm">
      <Group gap={10} wrap="nowrap" align="flex-end" className={styles.header}>
        <ActionIcon onClick={open} size="md">
          <IconMenu2 />
        </ActionIcon>
        <Link to="/">
          <Image w="auto" h="2.3rem" src="/images/logo.png" />
        </Link>
        <Stack style={{ flex: 1, gap: "0.2rem" }} gap={0}>
          <Group
            justify="space-between"
            wrap="nowrap"
            style={{ fontSize: "0.9rem" }}>
            <Group gap="0.3rem" wrap="nowrap">
              <ActionIcon
                component="a"
                href={book.source}
                target="_blank"
                size={rem(24)}
                p={0}
                variant="transparent"
                styles={{
                  root: {
                    border: "none",
                    visibility: `${book.source ? "visible" : "hidden"}`,
                  },
                }}>
                <IconLink />
              </ActionIcon>
              {pageNum > 1 && (
                <Text
                  pl="0.1rem"
                  component="h1"
                  fw="normal"
                  fz="inherit"
                  lineClamp={1}>
                  {book.title}
                </Text>
              )}
            </Group>
            <Group gap="0.3rem" wrap="nowrap">
              <Text component="span" fw={500} fz="inherit">
                {`${pageNum}/${book.pageCount}`}
              </Text>
              <BookmarksMenu />
            </Group>
          </Group>
          <ReadSlider book={book} pageNum={pageNum} />
        </Stack>
      </Group>
    </Paper>
  );
}

export default memo(ReadPaneHeader);
