import { Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { memo } from "react";
import PopupDropdown from "./PopupDropdown";

function Popup({ children, id }) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    // TODO try with onOpen prop (on Popover) to get the data when dropdown opens
    // https://github.com/TanStack/query/discussions/5820#discussioncomment-6604337
    // last comment here
    <Popover
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onMouseEnter={open}
      onMouseLeave={close}>
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <PopupDropdown id={id} />
      </Popover.Dropdown>
    </Popover>
  );
}

export default memo(Popup);
