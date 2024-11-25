import { memo } from "react";
import { Button, rem, Tabs, Text, Tooltip } from "@mantine/core";
import { IconExternalLink, IconPhoto } from "@tabler/icons-react";
import DictIFrame from "./DictIFrame";
import DictFavicon from "./DictFavicon";
import Sentences from "./Sentences";
import classes from "./DictPane.module.css";

function DictPane({ dicts, term, activeTab, onSetActiveTab }) {
  return (
    <Tabs
      value={activeTab}
      classNames={{ root: classes.tabs }}
      styles={{ tab: { paddingBlock: "xs" }, tabLabel: { minWidth: 0 } }}>
      <Tabs.List className={`${classes.flex} ${classes.tabList}`}>
        <div
          style={{
            display: "grid",
            alignItems: "center",
            gridTemplateColumns: `repeat(${dicts.length}, minmax(3rem, 8rem))`,
          }}>
          {dicts.map((dict, index) => {
            return (
              <Tooltip key={dict.label} label={dict.label} openDelay={200}>
                {dict.isExternal ? (
                  <Button
                    component="a"
                    ml={rem(2)}
                    variant="default"
                    fw="normal"
                    leftSection={<DictFavicon hostname={dict.hostname} />}
                    rightSection={
                      <IconExternalLink size={rem(14)} stroke={1.6} />
                    }
                    onClick={() =>
                      handleExternal(getLookupURL(dict.url, term))
                    }>
                    {dict.label}
                  </Button>
                ) : (
                  <Tabs.Tab
                    onClick={() => onSetActiveTab(String(index))}
                    className={classes.flex}
                    id={String(index)}
                    value={String(index)}
                    leftSection={<DictFavicon hostname={dict.hostname} />}>
                    <Text size="sm" style={{ overflow: "hidden" }}>
                      {dict.label}
                    </Text>
                  </Tabs.Tab>
                )}
              </Tooltip>
            );
          })}
        </div>
        <div style={{ display: "flex" }}>
          <Tabs.Tab
            className={classes.flex}
            id="sentencesTab"
            value="sentencesTab"
            onClick={() => onSetActiveTab("sentencesTab")}>
            <Text size="sm" style={{ overflow: "hidden" }}>
              Sentences
            </Text>
          </Tabs.Tab>
          <Tabs.Tab
            className={classes.flex}
            styles={{ tabLabel: { minWidth: 0 } }}
            id="imagesTab"
            value="imagesTab"
            onClick={() => onSetActiveTab("imagesTab")}>
            <IconPhoto size={rem(18)} />
          </Tabs.Tab>
        </div>
      </Tabs.List>

      {dicts.map((dict, index) => {
        return (
          !dict.isExternal && (
            <Tabs.Panel
              style={{ height: "100%" }}
              key={dict.label}
              id={String(index)}
              value={String(index)}>
              <DictIFrame src={getLookupURL(dict.url, term)} />
            </Tabs.Panel>
          )
        );
      })}
      <Tabs.Panel
        style={{ height: "100%" }}
        id="sentencesTab"
        value="sentencesTab">
        {/* <Sentences /> */}
        SENTENCES
      </Tabs.Panel>
      <Tabs.Panel style={{ height: "100%" }} id="imagesTab" value="imagesTab">
        IMAGES
      </Tabs.Panel>
    </Tabs>
  );
}

function getLookupURL(dictURL, term) {
  let url = dictURL;
  url = url.replace("###", getCleanTermString(term));

  return url;
}

function getCleanTermString(term) {
  // Terms are saved with zero-width space between each token;
  // remove that for dict searches.
  const zeroWidthSpace = "\u200b";
  const sqlZWS = "%E2%80%8B";
  const cleanText = term.replaceAll(zeroWidthSpace, "").replace(/\s+/g, " ");
  const searchTerm = encodeURIComponent(cleanText).replaceAll(sqlZWS, "");

  return searchTerm;
}

function handleExternal(url) {
  let settings =
    "width=800, height=600, scrollbars=yes, menubar=no, resizable=yes, status=no";
  // if (newTab) settings = null;
  window.open(url, "otherwin", settings);
}

export default memo(DictPane);
