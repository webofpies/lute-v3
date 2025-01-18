import { memo, useState } from "react";
import { Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import PopupData from "./PopupData";
import { popupQuery } from "../../api/term";

function Popup({ children, id }) {
  const queryClient = useQueryClient();
  const [opened, { close, open }] = useDisclosure(false);
  const [popupData, setPopupData] = useState(null);

  return (
    <Popover
      position="bottom"
      middlewares={{ flip: { fallbackPlacements: ["top", "right", "left"] } }}
      transitionProps={{
        duration: 150,
        transition: "fade-up",
        enterDelay: 50,
        exitDelay: 0,
      }}
      floatingStrategy="fixed"
      keepMounted={false}
      withArrow
      shadow="md"
      opened={opened}
      onOpen={async () =>
        setPopupData(await queryClient.fetchQuery(popupQuery(id)))
      }
      onMouseEnter={open}
      onMouseLeave={close}
      onContextMenu={close}>
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown
        style={{
          pointerEvents: "none",
          visibility: popupData ? "visible" : "hidden",
        }}>
        <PopupData data={popupData} />
      </Popover.Dropdown>
    </Popover>
  );
}

export default memo(Popup);
