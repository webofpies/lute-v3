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
import { IconEdit, IconMenu2 } from "@tabler/icons-react";
import ReadSlider from "./ReadSlider";
import PageActionsMenu from "./PageActionsMenu";
import FocusSwitch from "./FocusSwitch";
import HighlightsSwitch from "./HighlightsSwitch";
import BookSourceButton from "./BookSourceButton";
import MarkRestAsKnownButton from "./MarkAsKnownButton";
import PageCounter from "./PageCounter";
import HomeImageLink from "../HomeImageLink/HomeImageLink";
import classes from "./ReadHeader.module.css";

function ReadHeader({ drawerOpen, book, state, dispatch, onActivateEdit }) {
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
        className={classes.header}>
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
            <ActionIcon
              onClick={onActivateEdit}
              size={rem(24)}
              p={0}
              variant="transparent"
              styles={{ root: { border: "none" } }}>
              <IconEdit size={rem(22)} />
            </ActionIcon>

            <Group
              justify="space-between"
              wrap="nowrap"
              flex={1}
              miw={0}
              gap={0}>
              {book.source && <BookSourceButton source={book.source} />}

              <Text
                component={page === 1 ? "h2" : "h1"}
                fw="normal"
                fz="inherit"
                lineClamp={1}>
                {book.title}
              </Text>
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

export default memo(ReadHeader);
