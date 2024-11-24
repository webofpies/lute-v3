import { memo } from "react";
import { useNavigation, useParams } from "react-router-dom";
import {
  ActionIcon,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import ReadSlider from "./ReadSlider";
import PageActionsMenu from "./PageActionsMenu";
import FocusSwitch from "./FocusSwitch";
import HighlightsSwitch from "./HighlightsSwitch";
import BookSourceButton from "./BookSourceButton";
import MarkRestAsKnownButton from "./MarkAsKnownButton";
import PageCounter from "./PageCounter";
import HomeImageLink from "../HomeImageLink/HomeImageLink";
import styles from "./ReadPane.module.css";

function ReadPaneHeader({ drawerOpen, book, state, dispatch }) {
  const params = useParams();
  const page = Number(params.page);
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <Paper
      radius={0}
      shadow="sm"
      styles={{ root: { position: "relative", zIndex: 2 } }}>
      <Group
        gap={rem(5)}
        wrap="nowrap"
        align="center"
        className={styles.header}>
        <ActionIcon onClick={drawerOpen} size="md">
          <IconMenu2 />
        </ActionIcon>
        <Center w={rem(48)} h={rem(48)} styles={{ root: { flexShrink: 0 } }}>
          {isLoading ? <Loader size="sm" /> : <HomeImageLink size={rem(48)} />}
        </Center>
        <Divider orientation="vertical" />
        <Stack gap="0.2rem">
          <FocusSwitch checked={state.focusMode} dispatch={dispatch} />
          <HighlightsSwitch checked={state.highlights} dispatch={dispatch} />
        </Stack>
        <Divider orientation="vertical" />
        <Stack w="100%" gap={0}>
          <Group justify="space-between" wrap="nowrap" fz="sm" gap={rem(4)}>
            <Group flex={`0 0 ${rem(24)}`} justify="center">
              {book.source && <BookSourceButton source={book.source} />}
            </Group>
            <Group justify="space-between" wrap="nowrap" flex={1}>
              {page > 1 && (
                <Text component="h1" fw="normal" fz="inherit" lineClamp={1}>
                  {book.title}
                </Text>
              )}
              <PageCounter currentPage={page} pageCount={book.pageCount} />
            </Group>
            <Group gap={0} wrap="nowrap">
              <PageActionsMenu />
              <MarkRestAsKnownButton />
            </Group>
          </Group>
          <ReadSlider book={book} />
        </Stack>
      </Group>
    </Paper>
  );
}

export default memo(ReadPaneHeader);
