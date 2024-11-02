import { ActionIcon, Group, Slider } from "@mantine/core";
import {
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";
import { memo } from "react";

function ReadSlider({ book, page, onSetPage }) {
  return (
    <Group gap="0.8rem">
      <ActionIcon
        p={0}
        onClick={() => onSetPage((p) => p - 1 || 1)}
        variant="transparent"
        size="md"
        style={{ backgroundColor: "transparent" }}
        disabled={book.pageCount === 1 || page === 1}>
        <IconSquareRoundedChevronLeftFilled
          style={{ width: "100%", height: "100%" }}
          stroke={1.5}
        />
      </ActionIcon>
      <Slider
        style={{ flex: 1 }}
        styles={{ root: { padding: 0 } }}
        size="lg"
        thumbSize={18}
        value={page}
        onChange={onSetPage}
        min={1}
        max={book.pageCount}
        inverted={book.isRightToLeft}
        disabled={book.pageCount === 1}
        showLabelOnHover={false}
      />
      <ActionIcon
        onClick={() => {
          onSetPage((p) => (p + 1 > book.pageCount ? book.pageCount : p + 1));
        }}
        variant="transparent"
        size="md"
        style={{ backgroundColor: "transparent" }}
        disabled={book.pageCount === 1 || page === book.pageCount}>
        <IconSquareRoundedChevronRightFilled
          style={{ width: "100%", height: "100%" }}
          stroke={1.5}
        />
      </ActionIcon>
    </Group>
  );
}

export default memo(ReadSlider);
