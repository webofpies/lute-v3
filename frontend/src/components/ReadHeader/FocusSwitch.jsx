import { rem, Switch, Tooltip } from "@mantine/core";
import { IconFocus2 } from "@tabler/icons-react";
import { handleToggleFocusMode } from "../../misc/actions";

function FocusSwitch({ checked, dispatch }) {
  return (
    <Tooltip
      label="Focus mode"
      position="left"
      openDelay={800}
      refProp="rootRef">
      <Switch
        checked={checked}
        onChange={(e) => {
          handleToggleFocusMode(Boolean(e.currentTarget.checked), dispatch);
        }}
        size="sm"
        onLabel="ON"
        offLabel="OFF"
        thumbIcon={
          <IconFocus2
            style={{ width: rem(12), height: rem(12) }}
            color="teal"
            stroke={2}
          />
        }
      />
    </Tooltip>
  );
}

export default FocusSwitch;
