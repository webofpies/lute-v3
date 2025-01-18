import { memo } from "react";
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
  Switch,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconEdit,
  IconFocus2,
  IconHighlight,
  IconLink,
  IconMenu2,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";
import PageSlider from "./PageSlider";
import BookmarksButton from "./BookmarksButton";
import BookmarksMenu from "./BookmarksMenu";
import HomeImageLink from "@common/HomeImageLink/HomeImageLink";
import { resetFocusActiveSentence } from "@actions/interactions-desktop";
import { handleSetFocusMode, handleSetHighlights } from "@actions/general";
import classes from "./ReadHeader.module.css";

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
        <ActionIcon onClick={onDrawerOpen} size="md" variant="subtle">
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
            <EditButton onActivate={handleActivateEdit} />
            <div className={classes.titleFlex}>
              <Title currentPage={page} title={book.title} />
              {book.source && <BookSourceButton source={book.source} />}
              <PageCounter currentPage={page} pageCount={book.pageCount} />
            </div>

            <Group gap={0} wrap="nowrap">
              {book.bookmarks ? (
                <BookmarksMenu data={book.bookmarks} />
              ) : (
                <BookmarksButton disabled={true} />
              )}
              <MarkRestAsKnownButton />
            </Group>
          </div>

          <PageSlider book={book} />
        </Stack>
      </Group>
    </Paper>
  );
}

function Title({ currentPage, title }) {
  return (
    <Text
      component={currentPage === 1 ? "h2" : "h1"}
      fw="normal"
      fz="inherit"
      lineClamp={1}>
      {title}
    </Text>
  );
}

function MarkRestAsKnownButton() {
  return (
    <Tooltip label="Mark rest as known" position="right">
      <ActionIcon
        color="green.6"
        size={24}
        variant="transparent"
        styles={{
          root: { border: "none", backgroundColor: "transparent" },
        }}>
        <IconRosetteDiscountCheckFilled />
      </ActionIcon>
    </Tooltip>
  );
}

function EditButton({ onActivate }) {
  return (
    <ActionIcon
      onClick={onActivate}
      size={24}
      p={0}
      variant="transparent"
      styles={{ root: { border: "none" } }}>
      <IconEdit size={rem(22)} />
    </ActionIcon>
  );
}

function PageCounter({ currentPage, pageCount }) {
  return (
    <Text
      component="span"
      fw={500}
      fz="inherit"
      lh={1}
      ml="auto"
      miw={24}
      style={{ flexShrink: 0 }}>
      {`${currentPage}/${pageCount}`}
    </Text>
  );
}

function BookSourceButton({ source }) {
  return (
    <ActionIcon
      styles={{ root: { border: "none" } }}
      display="block"
      component="a"
      href={source}
      target="_blank"
      size={20}
      p={0}
      variant="transparent">
      <IconLink />
    </ActionIcon>
  );
}

function FocusSwitch({ checked, dispatch }) {
  return (
    <Tooltip
      label="Focus mode"
      position="left"
      openDelay={800}
      refProp="rootRef">
      <Switch
        checked={checked}
        onChange={(e) => {
          handleSetFocusMode(Boolean(e.currentTarget.checked), dispatch);
        }}
        size="sm"
        onLabel="ON"
        offLabel="OFF"
        thumbIcon={
          <IconFocus2
            style={{ width: rem(12), height: rem(12) }}
            color="teal"
            stroke={2}
          />
        }
      />
    </Tooltip>
  );
}

function HighlightsSwitch({ checked, dispatch }) {
  return (
    <Tooltip
      label="Term highlights"
      position="left"
      openDelay={800}
      refProp="rootRef">
      <Switch
        checked={checked}
        onChange={(e) => {
          handleSetHighlights(Boolean(e.currentTarget.checked), dispatch);
        }}
        size="sm"
        onLabel="ON"
        offLabel="OFF"
        thumbIcon={
          <IconHighlight
            style={{ width: rem(12), height: rem(12) }}
            color="teal"
            stroke={2}
          />
        }
      />
    </Tooltip>
  );
}

export default memo(ReadHeader);
