import { memo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ActionIcon,
  Button,
  Image,
  Menu,
  Tabs,
  Text,
  Tooltip,
} from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import {
  IconChevronDown,
  IconExternalLink,
  IconPhoto,
} from "@tabler/icons-react";
import Sentences from "@term/components/Sentences/Sentences";
import { sentencesQuery } from "@term/api/term";
import { getLookupURL, handleExternalUrl } from "@actions/utils";
import { MAX_VISIBLE_DICT_TABS } from "@resources/constants";
import classes from "./DictTabs.module.css";

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

  const allDicts = language.dictionaries.term;
  const visibleDicts = allDicts.slice(0, MAX_VISIBLE_DICT_TABS);
  const dropdownDicts = allDicts.slice(MAX_VISIBLE_DICT_TABS);

  function handleFocus() {
    setTimeout(() => {
      const input = translationFieldRef?.current;
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  }

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
          <Sentences langId={language.id} termText={term} />
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
      onClick={() => handleExternalUrl(getLookupURL(dict.url, term))}>
      {dict.label}
    </Component>
  );
}

function DictDropdown({ term, dicts, onClick }) {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon
          variant="transparent"
          mr="auto"
          ml="xs"
          style={{ alignSelf: "center" }}>
          <IconChevronDown />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {dicts.map((dict) =>
          dict.isExternal ? (
            <DictTabExternal
              key={dict.label}
              dict={dict}
              term={term}
              component={Menu.Item}
            />
          ) : (
            <DictTabEmbedded
              key={dict.label}
              dict={dict}
              value={String("dropdownTab")}
              onClick={() => onClick(dict.url)}
              component={Menu.Item}
            />
          )
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

function Iframe({ src, onHandleFocus }) {
  // lazy loading makes sure dict loads only on tab open. if not set all dicts load at the same time
  return (
    <iframe
      onLoad={onHandleFocus}
      style={{ border: "none" }}
      width="100%"
      height="100%"
      src={src}
      loading="lazy"></iframe>
  );
}

function DictFavicon({ hostname }) {
  return (
    <Image
      h={16}
      w={16}
      src={`http://www.google.com/s2/favicons?domain=${hostname}`}
    />
  );
}

export default memo(DictTabs);
