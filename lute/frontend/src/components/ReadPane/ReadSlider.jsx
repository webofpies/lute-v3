import { memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionIcon, Group, Slider } from "@mantine/core";
import {
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";
import { nprogress } from "@mantine/nprogress";

function ReadSlider({ book }) {
  const navigate = useNavigate();
  const { id, page } = useParams();

  return (
    <Group gap="0.8rem">
      <ActionIcon
        p={0}
        onClick={() => {
          const prevPage = Number(page) - 1 || 1;
          navigate(`/read/${id}/${prevPage}`);
          nprogress.start();
        }}
        variant="transparent"
        size="md"
        style={{ backgroundColor: "transparent" }}
        disabled={book.pageCount === 1 || Number(page) === 1}>
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
        value={Number(page)}
        onChange={(v) => {
          navigate(`/read/${id}/${v}`);
          nprogress.start();
        }}
        min={1}
        max={book.pageCount}
        inverted={book.isRightToLeft}
        disabled={book.pageCount === 1}
        showLabelOnHover={false}
      />
      <ActionIcon
        onClick={() => {
          const nextPage =
            Number(page) + 1 > book.pageCount
              ? book.pageCount
              : Number(page) + 1;
          navigate(`/read/${id}/${nextPage}`);
          nprogress.start();
        }}
        variant="transparent"
        size="md"
        style={{ backgroundColor: "transparent" }}
        disabled={book.pageCount === 1 || Number(page) === book.pageCount}>
        <IconSquareRoundedChevronRightFilled
          style={{ width: "100%", height: "100%" }}
          stroke={1.5}
        />
      </ActionIcon>
    </Group>
  );
}

export default memo(ReadSlider);
