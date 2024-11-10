import { memo } from "react";
import { Link } from "react-router-dom";
import {
  ActionIcon,
  Grid,
  Group,
  Image,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { IconBookmarkPlus, IconLink, IconMenu2 } from "@tabler/icons-react";
import ReadSlider from "./ReadSlider";
import styles from "./ReadPane.module.css";

function ReadPaneHeader({ open, pageNum, book, width }) {
  return (
    <Group
      gap={10}
      align="flex-end"
      className={styles.header}
      style={{ width: `${width}%` }}
      styles={{ root: { flexWrap: "nowrap" } }}>
      <ActionIcon onClick={open} variant="default" size="lg">
        <IconMenu2 style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
      <Link to="/">
        <Image w="auto" h="3rem" src="/images/logo.png" />
      </Link>
      <Stack style={{ flex: 1, gap: "0.2rem" }} gap={0}>
        <Grid
          align="center"
          gutter={0}
          style={{ fontSize: "0.9rem" }}
          styles={{ inner: { flexWrap: "nowrap" } }}>
          <Grid.Col span="auto">
            <Group gap="0.3rem">
              {book.source && (
                <ActionIcon
                  size={rem(24)}
                  p={0}
                  variant="transparent"
                  styles={{ root: { border: "none" } }}>
                  <IconLink stroke={2.5} />
                </ActionIcon>
              )}
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
          </Grid.Col>
          <Grid.Col span="fit-content">
            <Group gap="0.3rem" wrap="nowrap">
              <Text component="span" fw={500} fz="inherit">
                {`${pageNum}/${book.pageCount}`}
              </Text>
              <ActionIcon
                size={rem(24)}
                p={0}
                variant="transparent"
                styles={{ root: { border: "none" } }}>
                <IconBookmarkPlus stroke={2.5} />
              </ActionIcon>
            </Group>
          </Grid.Col>
        </Grid>
        <ReadSlider book={book} />
      </Stack>
    </Group>
  );
}

export default memo(ReadPaneHeader);
