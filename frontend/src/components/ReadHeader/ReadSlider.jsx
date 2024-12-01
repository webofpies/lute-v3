import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionIcon, Group, rem, Slider } from "@mantine/core";
import {
  IconSquareRoundedChevronLeftFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";
import { clamp } from "../../misc/utils";
import PageReadButton from "./PageReadButton";

function ReadSlider({ book }) {
  const params = useParams();
  const page = Number(params.page);
  const navigate = useNavigate();
  const [changeVal, setChangeVal] = useState(page);

  function goToPage(num) {
    const clamped = clamp(num, 1, book.pageCount);
    navigate(`/books/${book.id}/pages/${clamped}`);
    setChangeVal(clamped);
  }

  return (
    <Group gap={rem(2)} wrap="no-wrap">
      <ActionIcon
        p={0}
        onClick={() => goToPage(page - 1)}
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
        onChangeEnd={goToPage}
        min={1}
        max={book.pageCount}
        disabled={book.pageCount === 1}
        showLabelOnHover={false}
      />
      <Group gap={0} wrap="nowrap">
        <ActionIcon
          onClick={() => goToPage(page + 1)}
          size={rem(24)}
          variant="transparent"
          styles={{ root: { border: "none", backgroundColor: "transparent" } }}
          disabled={book.pageCount === 1 || page === book.pageCount}>
          <IconSquareRoundedChevronRightFilled />
        </ActionIcon>
        <PageReadButton book={book} onGoToPage={goToPage} />
      </Group>
    </Group>
  );
}

export default ReadSlider;
