import { Tabs, Text } from "@mantine/core";
import classes from "../DictTabs/DictTabs.module.css";
import DictFavicon from "../DictTabs/DictFavicon";

function DictTabEmbedded({
  dict,
  value,
  onSetActiveTab,
  onHandleFocus,
  innerRef,
}) {
  return (
    <Tabs.Tab
      ref={innerRef}
      onClick={() => {
        onSetActiveTab();
        onHandleFocus();
      }}
      className={classes.flex}
      id={value}
      value={value}
      leftSection={<DictFavicon hostname={dict.hostname} />}>
      <Text size="sm" style={{ overflow: "hidden" }}>
        {dict.label}
      </Text>
    </Tabs.Tab>
  );
}

export default DictTabEmbedded;
