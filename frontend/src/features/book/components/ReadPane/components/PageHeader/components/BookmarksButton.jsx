import { forwardRef } from "react";
import { ActionIcon } from "@mantine/core";
import { IconBookmarksFilled } from "@tabler/icons-react";

const BookmarksButton = forwardRef(function BookmarksButton(props, ref) {
  return (
    <ActionIcon
      {...props}
      ref={ref}
      size={24}
      p={0}
      variant="transparent"
      styles={{
        root: { border: "none", background: "transparent" },
      }}>
      <IconBookmarksFilled />
    </ActionIcon>
  );
});

export default BookmarksButton;
