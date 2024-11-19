import { rem, Switch, Tooltip } from "@mantine/core";
import { IconHighlight } from "@tabler/icons-react";
import { handleToggleHighlights } from "../../misc/textActions";

function HighlightsSwitch({ checked, dispatch }) {
  return (
    <Tooltip
      label="Term highlights"
      position="left"
      openDelay={800}
      refProp="rootRef">
      <Switch
        size="sm"
        checked={checked}
        onChange={(e) => {
          handleToggleHighlights(Boolean(e.currentTarget.checked), dispatch);
        }}
        onLabel="ON"
        offLabel="OFF"
        thumbIcon={
          <IconHighlight
            style={{ width: rem(12), height: rem(12) }}
            color="teal"
            stroke={2}
          />
        }
      />
    </Tooltip>
  );
}

export default HighlightsSwitch;
