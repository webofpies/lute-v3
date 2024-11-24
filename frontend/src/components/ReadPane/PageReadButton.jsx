import { ActionIcon, rem, Tooltip } from "@mantine/core";
import { useParams } from "react-router-dom";
import {
  IconSquareRoundedCheckFilled,
  IconSquareRoundedChevronRightFilled,
} from "@tabler/icons-react";

function PageReadButton({ book, onGoToPage }) {
  const params = useParams();
  const page = Number(params.page);

  return (
    <Tooltip
      position="right"
      label={
        page === book.pageCount
          ? "Mark page as read"
          : "Mark page as read and go to next page"
      }>
      <ActionIcon
        color="orange.4"
        onClick={() => onGoToPage(page + 1)}
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
  );
}

export default PageReadButton;
