import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionIcon, Group, rem, Slider } from "@mantine/core";
import {
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";

function ReadSlider({ book, pageNum }) {
  const navigate = useNavigate();
  const [changeVal, setChangeVal] = useState(pageNum);

  return (
    <Group gap="0.8rem" wrap="no-wrap">
      <ActionIcon
        p={0}
        onClick={() => {
          const newPage = Math.max(pageNum - 1, 1);
          navigate(`/read/${book.id}/${newPage}`);
          setChangeVal(newPage);
        }}
        size={rem(24)}
        variant="transparent"
        styles={{ root: { border: "none", backgroundColor: "transparent" } }}
        disabled={book.pageCount === 1 || pageNum === 1}>
        <IconSquareRoundedChevronLeftFilled />
      </ActionIcon>
      <Slider
        style={{ flex: 1 }}
        styles={{ root: { padding: 0 } }}
        size="md"
        thumbSize={rem(16)}
        value={changeVal}
        defaultValue={pageNum}
        onChange={setChangeVal}
        onChangeEnd={(v) => navigate(`/read/${book.id}/${v}`)}
        min={1}
        max={book.pageCount}
        disabled={book.pageCount === 1}
        showLabelOnHover={false}
      />
      <ActionIcon
        onClick={() => {
          const newPage = Math.min(pageNum + 1, book.pageCount);
          navigate(`/read/${book.id}/${newPage}`);
          setChangeVal(newPage);
        }}
        size={rem(24)}
        variant="transparent"
        styles={{ root: { border: "none", backgroundColor: "transparent" } }}
        disabled={book.pageCount === 1 || pageNum === book.pageCount}>
        <IconSquareRoundedChevronRightFilled />
      </ActionIcon>
    </Group>
  );
}

export default ReadSlider;
