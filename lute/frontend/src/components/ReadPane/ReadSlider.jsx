import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionIcon, Group, rem, Slider, Tooltip } from "@mantine/core";
import {
  IconSquareRoundedCheckFilled,
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";

function ReadSlider({ book }) {
  const params = useParams();
  const page = Number(params.page);
  const navigate = useNavigate();
  const [changeVal, setChangeVal] = useState(page);

  return (
    <Group gap={rem(2)} wrap="no-wrap">
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
      <Group gap={0} wrap="nowrap">
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
        <Tooltip
          label={
            page === book.pageCount
              ? "Mark page as read"
              : "Mark page as read and go to next page"
          }>
          <ActionIcon
            color="green.6"
            onClick={() => {
              const newPage = Math.min(page + 1, book.pageCount);
              navigate(`/book/${book.id}/page/${newPage}`);
              setChangeVal(newPage);
            }}
            size={rem(24)}
            variant="transparent"
            styles={{
              root: { border: "none", backgroundColor: "transparent" },
            }}
            disabled={book.pageCount === 1}>
            {page === book.pageCount ? (
              <IconSquareRoundedCheckFilled />
            ) : (
              <IconSquareRoundedChevronRightFilled />
            )}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}

export default ReadSlider;
