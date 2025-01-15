import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionIcon, Group, Slider, Tooltip } from "@mantine/core";
import {
  IconSquareRoundedCheckFilled,
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";
import { clamp } from "../../misc/utils";

function ReadSlider({ book }) {
  const params = useParams();
  const page = Number(params.page);
  const navigate = useNavigate();
  const [changeVal, setChangeVal] = useState(page);

  const pageReadLabel =
    page === book.pageCount
      ? "Mark page as read"
      : "Mark page as read and go to next page";
  const pageReadIcon =
    page === book.pageCount ? (
      <IconSquareRoundedCheckFilled />
    ) : (
      <IconSquareRoundedChevronRightFilled />
    );

  function goToPage(num) {
    const clamped = clamp(num, 1, book.pageCount);
    navigate(`/books/${book.id}/pages/${clamped}`);
    setChangeVal(clamped);
  }

  return (
    <Group gap={2} wrap="no-wrap">
      {/* go to previous page */}
      <ActionIcon
        p={0}
        onClick={() => goToPage(page - 1)}
        size={24}
        variant="transparent"
        styles={{ root: { border: "none", backgroundColor: "transparent" } }}
        disabled={book.pageCount === 1 || page === 1}>
        <IconSquareRoundedChevronLeftFilled />
      </ActionIcon>
      <Slider
        style={{ flex: 1 }}
        size="md"
        thumbSize={16}
        value={changeVal}
        defaultValue={page}
        onChange={setChangeVal}
        onChangeEnd={goToPage}
        min={1}
        max={book.pageCount}
        disabled={book.pageCount === 1}
        showLabelOnHover={false}
      />
      <Group gap={0} wrap="nowrap">
        {/* go to next page */}
        <ActionIcon
          onClick={() => goToPage(page + 1)}
          size={24}
          variant="transparent"
          styles={{ root: { border: "none", backgroundColor: "transparent" } }}
          disabled={book.pageCount === 1 || page === book.pageCount}>
          <IconSquareRoundedChevronRightFilled />
        </ActionIcon>
        {/* mark page as read */}
        <Tooltip position="right" label={pageReadLabel}>
          <ActionIcon
            color="orange.4"
            onClick={() => goToPage(page + 1)}
            size={24}
            variant="transparent"
            styles={{
              root: { border: "none", backgroundColor: "transparent" },
            }}
            disabled={book.pageCount === 1}>
            {pageReadIcon}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}

export default ReadSlider;
