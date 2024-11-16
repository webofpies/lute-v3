import { memo, useEffect, useReducer } from "react";
import {
  ActionIcon,
  ActionIconGroup,
  Group,
  Paper,
  rem,
  Slider,
  Text,
} from "@mantine/core";
import {
  IconChevronDown,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
} from "@tabler/icons-react";
import PlayerMenu from "./PlayerMenu";

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
  const [state, dispatch] = useInitializePlayer(
    book.id,
    book.audio.position,
    book.audio.bookmarks
  );

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

  function handleForwardRewind(amount) {
    const t = audio.currentTime + amount;
    audio.currentTime = t;
    dispatch({ type: "timeChanged", payload: t });
  }

  return (
    <Paper
      withBorder
      radius={0}
      shadow="sm"
      styles={{ root: { position: "relative", zIndex: 2 } }}>
      <Group
        justify="space-between"
        align="center"
        gap="sm"
        wrap="nowrap"
        pl="3rem"
        pr="2rem"
        pt="0.3rem"
        pb="0.3rem">
        <Group gap={rem(8)} wrap="nowrap">
          {/* SKIP BACK BUTTON */}
          <ActionIcon
            onClick={() => (audio.currentTime = 0)}
            radius="50%"
            size={rem(22)}>
            <IconPlayerSkipBackFilled size="60%" />
          </ActionIcon>

          <ActionIcon onClick={handlePlayPause} radius="50%" size={rem(26)}>
            {state.playing ? (
              <IconPlayerPauseFilled size="60%" />
            ) : (
              <IconPlayerPlayFilled size="60%" />
            )}
          </ActionIcon>

          <ActionIconGroup>
            <ActionIcon
              onClick={() => handleForwardRewind(-Number(state.skipAmount))}
              radius="50%"
              size={rem(22)}>
              <IconPlayerTrackPrevFilled size="60%" />
            </ActionIcon>
            <ActionIcon
              onClick={() => handleForwardRewind(Number(state.skipAmount))}
              radius="50%"
              size={rem(22)}>
              <IconPlayerTrackNextFilled size="60%" />
            </ActionIcon>
          </ActionIconGroup>
        </Group>

        <Group justify="space-between" flex={1} wrap="nowrap" gap={rem(5)}>
          <Text
            fz="xs"
            component="span"
            miw={rem(50)}
            style={{ textAlign: "center" }}>
            {timeToDisplayString(state.time)}
          </Text>
          {/* TIME SLIDER */}
          <Slider
            label={null}
            marks={state.bookmarks}
            value={state.time}
            min={0}
            max={state.duration}
            step={0.1}
            onChange={(v) => (audio.currentTime = v)}
            styles={{
              mark: {
                backgroundColor: "#ff6b6b",
              },
              root: { flex: 1 },
              thumb: { borderWidth: "2px" },
            }}
            size="md"
            thumbSize={rem(12)}
          />
          <Text
            fz="xs"
            component="span"
            miw={rem(50)}
            style={{ textAlign: "center" }}>
            {timeToDisplayString(state.duration)}
          </Text>
        </Group>

        <Slider
          size="sm"
          value={state.volume}
          min={0}
          max={1}
          step={0.05}
          onChange={handleVolumeChange}
          styles={{ thumb: { borderWidth: "2px" }, root: { flex: 0.12 } }}
        />
        <PlayerMenu audio={audio} dispatch={dispatch} state={state}>
          <ActionIcon
            size={rem(24)}
            p={0}
            variant="transparent"
            styles={{ root: { border: "none" } }}>
            <IconChevronDown />
          </ActionIcon>
        </PlayerMenu>
      </Group>
    </Paper>
  );
}

function useInitializePlayer(id, position, bookmarks) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    audio.src = `http://localhost:5001/useraudio/stream/${id}`;

    // retrieve last position
    audio.currentTime = position;
    dispatch({ type: "timeChanged", payload: position });
    // retrieve bookmarks
    bookmarks.forEach((bookmark) =>
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
  }, [bookmarks, position, id]);

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
