import DictFavicon from "../DictTabs/DictFavicon";
import { IconExternalLink } from "@tabler/icons-react";
import { getLookupURL } from "../../misc/utils";

function DictTabExternal({ dict, term, innerRef, component: Component }) {
  return (
    <Component
      ref={innerRef}
      component="a"
      variant="default"
      fw="normal"
      ml={2}
      leftSection={<DictFavicon hostname={dict.hostname} />}
      rightSection={<IconExternalLink size={16} stroke={1.6} />}
      onClick={() => handleExternal(getLookupURL(dict.url, term))}>
      {dict.label}
    </Component>
  );
}

function handleExternal(url) {
  let settings =
    "width=800, height=600, scrollbars=yes, menubar=no, resizable=yes, status=no";
  // if (newTab) settings = null;
  window.open(url, "otherwin", settings);
}

export default DictTabExternal;
