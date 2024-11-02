import { ActionIcon, Grid, Group, Image, Stack, Text } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import ReadSlider from "./ReadSlider";
import styles from "./ReadPane.module.css";

function ReadPaneHeader({ open, currentPage, book, setCurrentPage, width }) {
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
      <Stack style={{ flex: 1 }} gap={0}>
        <Grid
          align="center"
          gutter={0}
          style={{ paddingInline: "2.1rem", fontSize: "0.9rem" }}
          styles={{ inner: { flexWrap: "nowrap" } }}>
          <Grid.Col span="auto">
            {currentPage > 1 && (
              <Text component="h1" fw="normal" fz="inherit" lineClamp={1}>
                {book.title}
              </Text>
            )}
          </Grid.Col>
          <Grid.Col span="fit-content">
            <Text component="span" fw={500} fz="inherit">
              {`${currentPage}/${book.pageCount}`}
            </Text>
          </Grid.Col>
        </Grid>
        <ReadSlider book={book} page={currentPage} onSetPage={setCurrentPage} />
      </Stack>
    </Group>
  );
}

export default memo(ReadPaneHeader);
