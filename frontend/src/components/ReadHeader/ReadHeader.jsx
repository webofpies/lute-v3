import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useParams, useSearchParams } from "react-router-dom";
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
import BookmarksButton from "./BookmarksButton";
import BookmarksMenu from "./BookmarksMenu";
import FocusSwitch from "./FocusSwitch";
import HighlightsSwitch from "./HighlightsSwitch";
import BookSourceButton from "./BookSourceButton";
import MarkRestAsKnownButton from "./MarkAsKnownButton";
import PageCounter from "./PageCounter";
import HomeImageLink from "../HomeImageLink/HomeImageLink";
import classes from "./ReadHeader.module.css";
import { resetFocusActiveSentence } from "../../lute";
import { bookmarksQuery } from "../../queries/bookmark";

function ReadHeader({
  onDrawerOpen,
  book,
  focusMode,
  highlights,
  dispatch,
  onSetActiveTerm,
}) {
  const params = useParams();
  const page = Number(params.page);
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const [, setSearchParams] = useSearchParams();
  const { data: bookmarks } = useQuery(bookmarksQuery(params.id));

  function handleActivateEdit() {
    onSetActiveTerm({ data: null });
    resetFocusActiveSentence();
    setSearchParams({ edit: "true" });
  }

  return (
    <Paper
      classNames={{ root: "readpage" }}
      h={80}
      radius={0}
      shadow="sm"
      styles={{ root: { position: "relative", zIndex: 2 } }}>
      <Group gap={5} wrap="nowrap" align="center" className={classes.header}>
        <ActionIcon onClick={onDrawerOpen} size="md">
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
          <FocusSwitch checked={focusMode} dispatch={dispatch} />
          <HighlightsSwitch checked={highlights} dispatch={dispatch} />
        </Stack>

        <Divider orientation="vertical" />

        <Stack w="100%" gap={0}>
          <div className={classes.titleFlex}>
            <ActionIcon
              onClick={handleActivateEdit}
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
              {bookmarks ? (
                <BookmarksMenu data={bookmarks} />
              ) : (
                <BookmarksButton disabled={true} />
              )}
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
