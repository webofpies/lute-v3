import { Button, rem } from "@mantine/core";
import DictFavicon from "../DictTabs/DictFavicon";
import { IconExternalLink } from "@tabler/icons-react";
import { getLookupURL } from "../../misc/utils";

function DictTabExternal({ dict, term, innerRef }) {
  return (
    <Button
      ref={innerRef}
      component="a"
      ml={rem(2)}
      variant="default"
      fw="normal"
      leftSection={<DictFavicon hostname={dict.hostname} />}
      rightSection={<IconExternalLink size={16} stroke={1.6} />}
      onClick={() => handleExternal(getLookupURL(dict.url, term))}>
      {dict.label}
    </Button>
  );
}

function handleExternal(url) {
  let settings =
    "width=800, height=600, scrollbars=yes, menubar=no, resizable=yes, status=no";
  // if (newTab) settings = null;
  window.open(url, "otherwin", settings);
}

export default DictTabExternal;
