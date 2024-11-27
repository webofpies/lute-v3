import { memo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, rem, Tabs, Text, Tooltip } from "@mantine/core";
import { IconExternalLink, IconPhoto } from "@tabler/icons-react";
import Iframe from "./Iframe";
import DictFavicon from "./DictFavicon";
import Sentences from "../Sentences/Sentences";
import classes from "./DictTabs.module.css";
import { sentencesFetchOptions } from "../../queries/sentences";

function DictTabs({ dicts, langId, term, activeTab, onSetActiveTab }) {
  const queryClient = useQueryClient();

  return (
    <Tabs
      value={activeTab}
      classNames={{ root: classes.tabs }}
      styles={{
        tab: { paddingBlock: "xs" },
        tabLabel: { minWidth: 0 },
        root: { height: "100%" },
      }}>
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
            onMouseEnter={() =>
              queryClient.prefetchQuery(sentencesFetchOptions(langId, term))
            }
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
              <Iframe src={getLookupURL(dict.url, term)} />
            </Tabs.Panel>
          )
        );
      })}
      <Tabs.Panel
        style={{ overflowY: "auto", flexGrow: 1 }}
        id="sentencesTab"
        value="sentencesTab"
        key="sentencesTab">
        {activeTab === "sentencesTab" && (
          <Sentences
            sentencesFetchOptions={sentencesFetchOptions(langId, term)}
          />
        )}
      </Tabs.Panel>
      <Tabs.Panel
        style={{ height: "100%" }}
        id="imagesTab"
        value="imagesTab"
        key="imagesTab">
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

export default memo(DictTabs);
