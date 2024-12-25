import { memo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, Text, Tooltip } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import Iframe from "./Iframe";
import Sentences from "../Sentences/Sentences";
import DictTabEmbedded from "../DictTab/DictTabEmbedded";
import DictTabExternal from "../DictTab/DictTabExternal";
import classes from "./DictTabs.module.css";
import { sentencesFetchOptions } from "../../queries/sentences";
import { getLookupURL } from "../../misc/utils";

function DictTabs({ language, term, translationFieldRef = {} }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("0");

  function handleFocus() {
    setTimeout(() => {
      const input = translationFieldRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  }

  return (
    <Tabs
      dir="ltr"
      value={activeTab}
      classNames={{ root: classes.tabs }}
      styles={{
        tab: { paddingBlock: "xs" },
        tabLabel: { minWidth: 0 },
      }}>
      <Tabs.List className={`${classes.flex} ${classes.tabList}`}>
        <div
          style={{
            display: "grid",
            alignItems: "center",
            gridTemplateColumns: `repeat(${language.dictionaries.term.length}, minmax(3rem, 8rem))`,
          }}>
          {language.dictionaries.term.map((dict, index) => (
            <Tooltip
              key={dict.label}
              label={dict.label}
              openDelay={150}
              refProp="innerRef">
              {dict.isExternal ? (
                <DictTabExternal dict={dict} term={term} />
              ) : (
                <DictTabEmbedded
                  dict={dict}
                  value={String(index)}
                  onSetActiveTab={() => setActiveTab(String(index))}
                  onHandleFocus={handleFocus}
                />
              )}
            </Tooltip>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          <Tabs.Tab
            className={classes.flex}
            id="sentencesTab"
            value="sentencesTab"
            onMouseEnter={() =>
              queryClient.prefetchQuery(
                sentencesFetchOptions(language.id, term)
              )
            }
            onClick={() => {
              setActiveTab("sentencesTab");
              handleFocus();
            }}>
            <Text size="sm" style={{ overflow: "hidden" }}>
              Sentences
            </Text>
          </Tabs.Tab>
          <Tabs.Tab
            className={classes.flex}
            styles={{ tabLabel: { minWidth: 0 } }}
            id="imagesTab"
            value="imagesTab"
            onClick={() => {
              setActiveTab("imagesTab");
              handleFocus();
            }}>
            <IconPhoto size={24} />
          </Tabs.Tab>
        </div>
      </Tabs.List>

      {language.dictionaries.term.map((dict, index) => {
        return (
          !dict.isExternal && (
            <Tabs.Panel
              style={{ height: "100%" }}
              key={dict.label}
              id={String(index)}
              value={String(index)}>
              <Iframe
                src={getLookupURL(dict.url, term)}
                onHandleFocus={handleFocus}
              />
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
            sentencesFetchOptions={sentencesFetchOptions(language.id, term)}
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

export default memo(DictTabs);
