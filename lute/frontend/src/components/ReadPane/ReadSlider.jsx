import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionIcon, Group, rem, Slider } from "@mantine/core";
import {
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";

function ReadSlider({ book }) {
  const params = useParams();
  const page = Number(params.page);
  const navigate = useNavigate();
  const [changeVal, setChangeVal] = useState(page);

  return (
    <Group gap="0.8rem" wrap="no-wrap">
      <ActionIcon
        p={0}
        onClick={() => {
          const newPage = Math.max(page - 1, 1);
          navigate(`/book/${book.id}/page/${newPage}`);
          setChangeVal(newPage);
        }}
        size={rem(24)}
        variant="transparent"
        styles={{ root: { border: "none", backgroundColor: "transparent" } }}
        disabled={book.pageCount === 1 || page === 1}>
        <IconSquareRoundedChevronLeftFilled />
      </ActionIcon>
      <Slider
        style={{ flex: 1 }}
        styles={{ root: { padding: 0 } }}
        size="md"
        thumbSize={rem(16)}
        value={changeVal}
        defaultValue={page}
        onChange={setChangeVal}
        onChangeEnd={(v) => navigate(`/book/${book.id}/page/${v}`)}
        min={1}
        max={book.pageCount}
        disabled={book.pageCount === 1}
        showLabelOnHover={false}
      />
      <ActionIcon
        onClick={() => {
          const newPage = Math.min(page + 1, book.pageCount);
          navigate(`/book/${book.id}/page/${newPage}`);
          setChangeVal(newPage);
        }}
        size={rem(24)}
        variant="transparent"
        styles={{ root: { border: "none", backgroundColor: "transparent" } }}
        disabled={book.pageCount === 1 || page === book.pageCount}>
        <IconSquareRoundedChevronRightFilled />
      </ActionIcon>
    </Group>
  );
}

export default ReadSlider;
