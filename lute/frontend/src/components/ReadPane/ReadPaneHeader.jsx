import { memo } from "react";
import { Link, useNavigation } from "react-router-dom";
import {
  ActionIcon,
  Center,
  Divider,
  Group,
  Image,
  Loader,
  Paper,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { IconLink, IconMenu2 } from "@tabler/icons-react";
import ReadSlider from "./ReadSlider";
import PageActionsMenu from "./PageActionsMenu";
import FocusSwitch from "./FocusSwitch";
import HighlightsSwitch from "./HighlightsSwitch";
import styles from "./ReadPane.module.css";

function ReadPaneHeader({ drawerOpen, pageNum, book, state, dispatch }) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <Paper
      radius={0}
      shadow="sm"
      styles={{ root: { position: "relative", zIndex: 2 } }}>
      <Group gap={10} wrap="nowrap" align="center" className={styles.header}>
        <ActionIcon onClick={drawerOpen} size="md">
          <IconMenu2 />
        </ActionIcon>
        <Center w="2.8rem" h="2.8rem" styles={{ root: { flexShrink: 0 } }}>
          {isLoading ? (
            <Loader size="sm" />
          ) : (
            <Link to="/">
              <Image
                w="2.8rem"
                h="2.8rem"
                src="/images/logo.png"
                style={{ objectFit: "contain" }}
              />
            </Link>
          )}
        </Center>
        <Divider orientation="vertical" />
        <Stack gap="0.2rem">
          <FocusSwitch checked={state.focusMode} dispatch={dispatch} />
          <HighlightsSwitch checked={state.highlights} dispatch={dispatch} />
        </Stack>
        <Divider orientation="vertical" />
        <Stack w="100%" gap={0}>
          <Group justify="space-between" wrap="nowrap" fz="sm">
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
            <Group gap={0} wrap="nowrap">
              <Text component="span" fw={500} fz="inherit" lh={1}>
                {`${pageNum}/${book.pageCount}`}
              </Text>
              <PageActionsMenu book={book} pageNum={pageNum} />
            </Group>
          </Group>
          <ReadSlider book={book} pageNum={pageNum} />
        </Stack>
      </Group>
    </Paper>
  );
}

export default memo(ReadPaneHeader);
