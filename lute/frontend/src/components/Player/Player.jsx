import { memo, useEffect, useReducer } from "react";
import {
  ActionIcon,
  ActionIconGroup,
  Flex,
  Group,
  Select,
  Slider,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconChevronLeft,
  IconChevronRight,
  IconMinus,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
  IconPlus,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@tabler/icons-react";
import classes from "./Player.module.css";

const audio = new Audio();

function reducer(state, action) {
  switch (action.type) {
    case "statusToggled":
      return { ...state, playing: !state.playing };
    case "volumeChanged":
      return { ...state, volume: action.payload };
    case "rateChanged":
      return { ...state, rate: action.payload };
    case "timeChanged":
      return { ...state, time: action.payload };
    case "durationSet":
      return { ...state, duration: action.payload };
    case "bookmarkSaved":
      return {
        ...state,
        bookmarks: [...state.bookmarks, { value: action.payload }].toSorted(
          function (a, b) {
            return a.value - b.value;
          }
        ),
      };
    case "bookmarkRemoved":
      return {
        ...state,
        bookmarks: state.bookmarks.filter(
          (mark) => mark.value !== action.payload
        ),
      };
    case "bookmarkActive":
      return {
        ...state,
        bookmarkActive: action.payload,
      };
    case "skipAmount":
      return {
        ...state,
        skipAmount: action.payload,
      };
    case "controlsReset":
      return { ...state, rate: 1, volume: 1, playing: false };
    default:
      throw new Error();
  }
}

const initialState = {
  playing: false,
  volume: 1,
  rate: 1,
  time: 0,
  duration: 0,
  bookmarks: [],
  bookmarkActive: false,
  skipAmount: "5",
};

function Player({ book }) {
  const [state, dispatch] = useInitializePlayer(book);

  useEffect(() => {
    function timeUpdateCallback() {
      const rounded = parseFloat(audio.currentTime.toFixed(1));
      state.bookmarks.map((bookmark) => bookmark.value).includes(rounded)
        ? dispatch({ type: "bookmarkActive", payload: true })
        : dispatch({ type: "bookmarkActive", payload: false });
    }

    audio.addEventListener("timeupdate", timeUpdateCallback);

    return () => {
      audio.removeEventListener("timeupdate", timeUpdateCallback);
    };
  }, [state.bookmarks, dispatch]);

  function handlePlayPause() {
    state.playing ? audio.pause() : audio.play();
    dispatch({ type: "statusToggled" });
  }

  function handleVolumeChange(volume) {
    audio.volume = volume;
    dispatch({ type: "volumeChanged", payload: audio.volume });
  }

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

  function handleForwardRewind(amount) {
    const t = audio.currentTime + amount;
    audio.currentTime = t;
    dispatch({ type: "timeChanged", payload: t });
  }

  return (
    <Flex align="center" gap="1.5rem" className={classes["main-container"]}>
      <ActionIcon onClick={handlePlayPause} radius="50%" size="5rem">
        {state.playing ? (
          <IconPlayerPauseFilled size="60%" />
        ) : (
          <IconPlayerPlayFilled size="60%" />
        )}
      </ActionIcon>
      <Stack className={classes["mid-container"]}>
        <Stack gap="0.2rem" className={classes["timeline-container"]}>
          {/* TIME SLIDER */}
          <Slider
            marks={state.bookmarks}
            value={state.time}
            min={0}
            max={state.duration}
            step={0.1}
            onChange={(v) => (audio.currentTime = v)}
            styles={{
              mark: { backgroundColor: "orangered" },
              thumb: { display: "none" },
              track: {
                overflow: "hidden",
                borderRadius: "var(--slider-radius)",
              },
              root: { padding: 0, height: "var(--slider-size)" },
            }}
            // radius="md"
            size="xl"
          />
          {/* TIMELINE VALUES */}
          <Group justify="space-between">
            <Text fz="sm" component="span">
              {timeToDisplayString(state.time)}
            </Text>
            <Text fz="sm" component="span">
              {timeToDisplayString(state.duration)}
            </Text>
          </Group>
        </Stack>
        <Group
          justify="center"
          wrap="nowrap"
          gap="0.8rem"
          className={classes["mind-controls-container"]}>
          {/* SKIP BACK BUTTON */}
          <ActionIcon
            onClick={() => (audio.currentTime = 0)}
            radius="50%"
            size="2rem">
            <IconPlayerSkipBackFilled size="60%" />
          </ActionIcon>
          {/* JUMP TO TIME */}
          <Group wrap="nowrap" className={classes["skip-container"]}>
            <ActionIconGroup>
              <ActionIcon
                onClick={() => handleForwardRewind(-Number(state.skipAmount))}
                radius="50%"
                size="1.7rem">
                <IconPlayerTrackPrevFilled size="60%" />
              </ActionIcon>
              <ActionIcon
                onClick={() => handleForwardRewind(Number(state.skipAmount))}
                radius="50%"
                size="1.7rem">
                <IconPlayerTrackNextFilled size="60%" />
              </ActionIcon>
            </ActionIconGroup>
            {/* JUMP TO TIME SELECT */}
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
          </Group>
          {/* PLAYBACK RATE */}
          <ActionIconGroup>
            <ActionIcon
              onClick={() => handlePlaybackRateChange(-0.1)}
              style={{ borderRadius: "50%" }}
              size="1.5rem">
              <IconMinus size="60%" />
            </ActionIcon>
            <UnstyledButton
              style={{ minWidth: "30px", textAlign: "center" }}
              onClick={handlePlaybackRateReset}>
              <Text fz="sm" component="span">
                {state.rate.toFixed(1)}
              </Text>
            </UnstyledButton>
            <ActionIcon
              onClick={() => handlePlaybackRateChange(0.1)}
              style={{ borderRadius: "50%" }}
              size="1.5rem">
              <IconPlus size="60%" />
            </ActionIcon>
          </ActionIconGroup>
        </Group>
      </Stack>
      <Stack className={classes["right-container"]}>
        <Slider
          value={state.volume}
          min={0}
          max={1}
          step={0.05}
          onChange={handleVolumeChange}
          thumbSize="1.4rem"
          thumbChildren={
            state.volume === 0 ? (
              <IconVolume3 size="70%" />
            ) : state.volume > 0.5 ? (
              <IconVolume size="70%" />
            ) : (
              <IconVolume2 size="70%" />
            )
          }
          styles={{ thumb: { borderWidth: "2px" } }}
        />
        <ActionIconGroup className={classes["bookmark-container"]}>
          <ActionIcon
            bg="transparent"
            onClick={handleSaveRemoveBookmark}
            radius={0}>
            {state.bookmarkActive ? (
              <IconBookmarkFilled
                size="100%"
                color="var(--mantine-color-blue-filled)"
              />
            ) : (
              <IconBookmark
                size="100%"
                color="var(--mantine-color-blue-filled)"
              />
            )}
          </ActionIcon>
          <ActionIconGroup>
            <ActionIcon
              onClick={() => handleSkipToBookmark("prev")}
              radius="50%"
              size="1.5rem">
              <IconChevronLeft />
            </ActionIcon>
            <ActionIcon
              onClick={() => handleSkipToBookmark("next")}
              radius="50%"
              size="1.5rem">
              <IconChevronRight />
            </ActionIcon>
          </ActionIconGroup>
        </ActionIconGroup>
      </Stack>
    </Flex>
  );
}

function useInitializePlayer(book) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    audio.src = `http://localhost:5001/useraudio/stream/${book.id}`;

    // retrieve last position
    const position = book.audio_current_pos || 0;
    audio.currentTime = position;
    dispatch({ type: "timeChanged", payload: position });
    // retrieve bookmarks
    book.audio_bookmarks.length > 0 &&
      book.audio_bookmarks.forEach((bookmark) =>
        dispatch({ type: "bookmarkSaved", payload: bookmark })
      );

    function timeUpdateCallback() {
      dispatch({ type: "timeChanged", payload: audio.currentTime });
    }

    function loadedMetadataCallback() {
      dispatch({ type: "durationSet", payload: audio.duration });
      dispatch({ type: "controlsReset" });

      audio.rate = 1.0;
      audio.volume = 1.0;
      audio.pause();
    }

    audio.addEventListener("timeupdate", timeUpdateCallback);
    audio.addEventListener("loadedmetadata", loadedMetadataCallback);

    return () => {
      audio.removeEventListener("timeupdate", timeUpdateCallback);
      audio.removeEventListener("loadedmetadata", loadedMetadataCallback);
    };
  }, [book.audio_bookmarks, book.audio_current_pos, book.id]);

  return [state, dispatch];
}

function timeToDisplayString(secs) {
  const minutes = Math.floor(secs / 60);
  const seconds = (secs % 60).toFixed(1);
  const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const s = secs % 60 < 10 ? `0${seconds}` : `${seconds}`;
  return `${m}:${s}`;
}

export default memo(Player);
