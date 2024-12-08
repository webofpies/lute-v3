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
      <Group gap={5} wrap="nowrap" align="center" className={classes.header}>
        <ActionIcon onClick={drawerOpen} size="md">
          <IconMenu2 />
        </ActionIcon>

        <Center
          w={48}
          h={48}
          styles={{ root: { flexShrink: 0, marginLeft: rem(16) } }}>
          {isLoading ? <Loader size="sm" /> : <HomeImageLink size={rem(48)} />}
        </Center>

        <Divider orientation="vertical" />

        <Stack gap={4}>
          <FocusSwitch checked={state.focusMode} dispatch={dispatch} />
          <HighlightsSwitch checked={state.highlights} dispatch={dispatch} />
        </Stack>

        <Divider orientation="vertical" />

        <Stack w="100%" gap={0}>
          <div className={classes.titleFlex}>
            <ActionIcon
              onClick={onActivateEdit}
              size={24}
              p={0}
              variant="transparent"
              styles={{ root: { border: "none" } }}>
              <IconEdit size={rem(22)} />
            </ActionIcon>
            <div className={classes.titleFlex}>
              <Text
                component={page === 1 ? "h2" : "h1"}
                fw="normal"
                fz="inherit"
                lineClamp={1}>
                {book.title}
              </Text>
              {book.source && <BookSourceButton source={book.source} />}
              <PageCounter currentPage={page} pageCount={book.pageCount} />
            </div>

            <Group gap={0} wrap="nowrap">
              <PageActionsMenu />
              <MarkRestAsKnownButton />
            </Group>
          </div>

          <ReadSlider book={book} />
        </Stack>
      </Group>
    </Paper>
  );
}

export default memo(ReadHeader);
