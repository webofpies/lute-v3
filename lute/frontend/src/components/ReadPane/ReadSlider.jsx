import { useNavigate } from "react-router-dom";
import { ActionIcon, Group, rem, Slider } from "@mantine/core";
import {
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";
import { nprogress } from "@mantine/nprogress";

function ReadSlider({ book, pageNum }) {
  const navigate = useNavigate();

  return (
    <Group gap="0.8rem" wrap="no-wrap">
      <ActionIcon
        p={0}
        onClick={() => {
          const prevPage = pageNum - 1 || 1;
          navigate(`/read/${book.id}/${prevPage}`);
          nprogress.start();
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
        value={pageNum}
        onChange={(v) => {
          navigate(`/read/${book.id}/${v}`);
          nprogress.start();
        }}
        min={1}
        max={book.pageCount}
        disabled={book.pageCount === 1}
        showLabelOnHover={false}
      />
      <ActionIcon
        onClick={() => {
          const nextPage =
            pageNum + 1 > book.pageCount ? book.pageCount : pageNum + 1;
          navigate(`/read/${book.id}/${nextPage}`);
          nprogress.start();
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
