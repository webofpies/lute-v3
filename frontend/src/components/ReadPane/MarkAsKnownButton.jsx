import { ActionIcon, rem, Tooltip } from "@mantine/core";
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";

function MarkRestAsKnownButton() {
  return (
    <Tooltip label="Mark rest as known" position="right">
      <ActionIcon
        color="green.6"
        size={rem(24)}
        variant="transparent"
        styles={{
          root: { border: "none", backgroundColor: "transparent" },
        }}>
        <IconRosetteDiscountCheckFilled />
      </ActionIcon>
    </Tooltip>
  );
}

export default MarkRestAsKnownButton;
