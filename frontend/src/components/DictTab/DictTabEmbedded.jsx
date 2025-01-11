import { Text } from "@mantine/core";
import classes from "../DictTabs/DictTabs.module.css";
import DictFavicon from "../DictTabs/DictFavicon";

function DictTabEmbedded({
  dict,
  value,
  innerRef,
  onClick,
  component: Component,
}) {
  return (
    <Component
      className={classes.flex}
      ref={innerRef}
      id={value}
      value={value}
      onClick={onClick}
      leftSection={<DictFavicon hostname={dict.hostname} />}>
      <Text size="sm" style={{ overflow: "hidden" }}>
        {dict.label}
      </Text>
    </Component>
  );
}

export default DictTabEmbedded;
