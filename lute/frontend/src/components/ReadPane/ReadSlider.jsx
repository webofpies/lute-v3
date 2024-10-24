import { ActionIcon, Group, Slider } from "@mantine/core";
import {
  // IconCaretLeftFilled,
  // IconCaretRightFilled,
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";
import { memo } from "react";

function ReadSlider({
  book,
  page,
  onSetPage,
  //  isPlaceholder
}) {
  // let marks = Array(book.page_count)
  //   .fill(0)
  //   .map((_, index) => {
  //     return { value: index + 1, label: index + 1 };
  //   })
  //   .slice(1, book.page_count - 1);

  // // marks.length / 10;

  // marks = marks.filter((mark, index) => index % 2 === 1);
  // console.log(marks);

  return (
    <Group gap="0.8rem">
      <ActionIcon
        p={0}
        onClick={() => onSetPage((p) => p - 1 || 1)}
        variant="transparent"
        size="md"
        style={{ backgroundColor: "transparent" }} // disabled state doesn't keep bg transparent
        disabled={book.page_count === 1 || page === 1}>
        <IconSquareRoundedChevronLeftFilled
          style={{ width: "100%", height: "100%" }}
          stroke={1.5}
        />
      </ActionIcon>
      <Slider
        // marks={marks}
        style={{ flex: 1 }}
        styles={{ root: { padding: 0 } }}
        size="lg"
        thumbSize={18}
        value={page} // enabling it doesn't update the slider until change ends (onChangeEnd), but needs to use refs
        onChange={onSetPage}
        min={1}
        max={book.page_count}
        inverted={book.is_rtl}
        disabled={book.page_count === 1}
        showLabelOnHover={false}
      />
      <ActionIcon
        onClick={() => {
          // if (!isPlaceholder) {
          onSetPage((p) => (p + 1 > book.page_count ? book.page_count : p + 1));
          // }
        }}
        variant="transparent"
        size="md"
        style={{ backgroundColor: "transparent" }}
        disabled={book.page_count === 1 || page === book.page_count}>
        <IconSquareRoundedChevronRightFilled
          style={{ width: "100%", height: "100%" }}
          stroke={1.5}
        />
      </ActionIcon>
    </Group>
  );
}

export default memo(ReadSlider);
