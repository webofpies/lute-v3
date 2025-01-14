import { memo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Tabs, Text, Tooltip } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import Iframe from "./Iframe";
import Sentences from "../Sentences/Sentences";
import DictTabEmbedded from "../DictTab/DictTabEmbedded";
import DictTabExternal from "../DictTab/DictTabExternal";
import DictDropdown from "./DictDropdown";
import classes from "./DictTabs.module.css";
import { sentencesQuery } from "../../queries/term";
import { getLookupURL } from "../../misc/utils";
import { useUncontrolled } from "@mantine/hooks";

const MAX_VISIBLE_DICT_TABS = 5;

function DictTabs({
  language,
  term,
  activeTab,
  onSetActiveTab,
  translationFieldRef = {},
}) {
  const queryClient = useQueryClient();
  const [activeDropdownUrl, setActiveDropdownUrl] = useState("");
  const [tabValue, setTabValue] = useUncontrolled({
    value: activeTab,
    defaultValue: "0",
    onChange: onSetActiveTab,
  });

  function handleFocus() {
    setTimeout(() => {
      const input = translationFieldRef?.current;
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  }

  const visibleDicts = language.dictionaries.term.slice(
    0,
    MAX_VISIBLE_DICT_TABS
  );
  const dropdownDicts = language.dictionaries.term.slice(MAX_VISIBLE_DICT_TABS);

  return (
    <Tabs
      dir="ltr"
      value={tabValue}
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
            gridTemplateColumns: `repeat(${visibleDicts.length}, minmax(3rem, 8rem))`,
          }}>
          {visibleDicts.map((dict, index) => (
            <Tooltip
              key={dict.label}
              label={dict.label}
              openDelay={150}
              refProp="innerRef">
              {dict.isExternal ? (
                <DictTabExternal dict={dict} term={term} component={Button} />
              ) : (
                <DictTabEmbedded
                  dict={dict}
                  value={String(index)}
                  onClick={() => {
                    setTabValue(String(index));
                    handleFocus();
                  }}
                  component={Tabs.Tab}
                />
              )}
            </Tooltip>
          ))}
        </div>

        {dropdownDicts.length > 0 && (
          <DictDropdown
            term={term}
            dicts={dropdownDicts}
            onClick={(url) => {
              setTabValue("dropdownTab");
              setActiveDropdownUrl(url);
              handleFocus();
            }}
          />
        )}

        <div style={{ display: "flex" }}>
          <Tabs.Tab
            className={classes.flex}
            id="sentencesTab"
            value="sentencesTab"
            onMouseEnter={() =>
              queryClient.prefetchQuery(sentencesQuery(language.id, term))
            }
            onClick={() => {
              setTabValue("sentencesTab");
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
              setTabValue("imagesTab");
              handleFocus();
            }}>
            <IconPhoto size={24} />
          </Tabs.Tab>
        </div>
      </Tabs.List>

      {visibleDicts.map((dict, index) => {
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
        style={{ height: "100%" }}
        key="dropdownTab"
        id="dropdownTab"
        value="dropdownTab">
        <Iframe
          src={getLookupURL(activeDropdownUrl, term)}
          onHandleFocus={handleFocus}
        />
      </Tabs.Panel>
      <Tabs.Panel
        style={{ overflowY: "auto", flexGrow: 1 }}
        id="sentencesTab"
        value="sentencesTab"
        key="sentencesTab">
        {tabValue === "sentencesTab" && (
          <Sentences langId={language.id} termId={term} />
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
