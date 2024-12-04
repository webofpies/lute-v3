import { rem, Switch, Tooltip } from "@mantine/core";
import { IconHighlight } from "@tabler/icons-react";
import { handleSetHighlights } from "../../misc/actions";

function HighlightsSwitch({ checked, dispatch }) {
  return (
    <Tooltip
      label="Term highlights"
      position="left"
      openDelay={800}
      refProp="rootRef">
      <Switch
        checked={checked}
        onChange={(e) => {
          handleSetHighlights(Boolean(e.currentTarget.checked), dispatch);
        }}
        size="sm"
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
