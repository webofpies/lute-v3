import {
  ActionIcon,
  ActionIconGroup,
  ActionIconGroupSection,
  Divider,
  Menu,
  Select,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconChevronLeft,
  IconChevronRight,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";

function PlayerMenu({ children, audio, state, dispatch }) {
  function handlePlaybackRateChange(delta) {
    const playbackRate = Math.min(
      Math.max((audio.playbackRate += delta), 0.1),
      10
    );
    audio.playbackRate = playbackRate;
    dispatch({ type: "rateChanged", payload: playbackRate });
  }

  function handlePlaybackRateReset() {
    audio.playbackRate = 1.0;
    dispatch({ type: "rateChanged", payload: 1.0 });
  }

  function handleSaveRemoveBookmark() {
    const roundedTime = parseFloat(audio.currentTime.toFixed(1));
    state.bookmarks.map((bookmark) => bookmark.value).includes(roundedTime)
      ? dispatch({ type: "bookmarkRemoved", payload: roundedTime })
      : dispatch({ type: "bookmarkSaved", payload: roundedTime });
  }

  function handleSkipToBookmark(direction) {
    let val;
    const currentTime = audio.currentTime;

    if (direction === "next") {
      val = state.bookmarks
        .map((bookmark) => bookmark.value)
        .find((val) => Number(val) > currentTime);
    } else {
      val = state.bookmarks
        .map((bookmark) => bookmark.value)
        .findLast((val) => Number(val) < currentTime);
    }

    if (!val) return;

    audio.currentTime = val;
    dispatch({ type: "timeChanged", payload: val });
  }

  return (
    <Menu position="bottom" offset={0} shadow="md">
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown p={10}>
        <Stack gap={5} align="center">
          <Text fz="xs">Playback rate</Text>
          <ActionIconGroup>
            <ActionIcon
              onClick={() => handlePlaybackRateChange(-0.1)}
              size="xs">
              <IconMinus size="80%" />
            </ActionIcon>
            <ActionIconGroupSection size="xs" variant="transparent">
              <Tooltip label="Click to reset" fz="xs">
                <UnstyledButton
                  miw={20}
                  fz="xs"
                  ta="center"
                  onClick={handlePlaybackRateReset}>
                  {state.rate.toFixed(1)}
                </UnstyledButton>
              </Tooltip>
            </ActionIconGroupSection>
            <ActionIcon onClick={() => handlePlaybackRateChange(0.1)} size="xs">
              <IconPlus size="80%" />
            </ActionIcon>
          </ActionIconGroup>

          <Divider w="100%" />

          <Text fz="xs">Bookmarks</Text>
          <ActionIconGroup style={{ alignItems: "center", gap: "4px" }}>
            <ActionIcon
              size={24}
              p={0}
              variant="transparent"
              onClick={handleSaveRemoveBookmark}
              styles={{ root: { border: "none" } }}>
              {state.bookmarkActive ? <IconBookmarkFilled /> : <IconBookmark />}
            </ActionIcon>
            <ActionIconGroup>
              <ActionIcon
                disabled={state.bookmarks.length === 0}
                onClick={() => handleSkipToBookmark("prev")}
                radius="50%"
                size="sm">
                <IconChevronLeft />
              </ActionIcon>
              <ActionIcon
                disabled={state.bookmarks.length === 0}
                onClick={() => handleSkipToBookmark("next")}
                radius="50%"
                size="sm">
                <IconChevronRight />
              </ActionIcon>
            </ActionIconGroup>
          </ActionIconGroup>

          <Divider w="100%" />

          <Text fz="xs">Skip amount</Text>
          <Select
            onChange={(_value, option) =>
              dispatch({ type: "skipAmount", payload: option.value })
            }
            allowDeselect={false}
            styles={{ root: { width: "5rem" } }}
            checkIconPosition="right"
            size="xs"
            value={state.skipAmount}
            data={[
              { value: "3", label: "3 sec" },
              { value: "5", label: "5 sec" },
              { value: "10", label: "10 sec" },
              { value: "30", label: "30 sec" },
              { value: "60", label: "60 sec" },
            ]}
          />
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}

export default PlayerMenu;
