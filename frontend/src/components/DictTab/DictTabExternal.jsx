import { Button, rem } from "@mantine/core";
import DictFavicon from "../DictTabs/DictFavicon";
import { IconExternalLink } from "@tabler/icons-react";

function DictTabExternal({ dict, onHandleExternal, innerRef }) {
  return (
    <Button
      ref={innerRef}
      component="a"
      ml={rem(2)}
      variant="default"
      fw="normal"
      leftSection={<DictFavicon hostname={dict.hostname} />}
      rightSection={<IconExternalLink size={rem(14)} stroke={1.6} />}
      onClick={onHandleExternal}>
      {dict.label}
    </Button>
  );
}

export default DictTabExternal;
