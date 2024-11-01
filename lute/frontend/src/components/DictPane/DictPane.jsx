import { memo } from "react";
import { Image, rem, Tabs, Text } from "@mantine/core";
import { IconExternalLink, IconPhoto } from "@tabler/icons-react";
import DictIFrame from "./DictIFrame";
import Sentences from "./Sentences";
import classes from "./DictPane.module.css";

function DictPane({ dicts, term }) {
  return (
    <Tabs
      defaultValue="0"
      styles={{
        root: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
        },
      }}>
      <Tabs.List
        className={classes.flex}
        style={{
          flexWrap: "nowrap",
        }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${dicts.length}, minmax(2rem, 8rem))`,
          }}>
          {dicts.map((dict, index) => {
            return (
              <Tabs.Tab
                className={classes.flex}
                styles={{ tabLabel: { minWidth: 0 } }}
                onClick={() => {
                  dict.isExternal &&
                    handleExternal(getLookupURL(dict.url, term));
                }}
                key={dict.label}
                id={String(index)}
                value={String(index)}
                rightSection={
                  dict.isExternal ? (
                    <IconExternalLink size={rem(16)} stroke={1.6} />
                  ) : (
                    ""
                  )
                }
                leftSection={
                  <Image
                    h={16}
                    w={16}
                    src={`http://www.google.com/s2/favicons?domain=${dict.hostname}`}
                  />
                }>
                <Text size="sm" style={{ overflow: "hidden" }}>
                  {dict.label}
                </Text>
              </Tabs.Tab>
            );
          })}
        </div>
        <div style={{ display: "flex" }}>
          <Tabs.Tab
            className={classes.flex}
            styles={{ tabLabel: { minWidth: 0 } }}
            id="sentencesTab"
            value="sentencesTab">
            <Text size="sm" style={{ overflow: "hidden" }}>
              Sentences
            </Text>
          </Tabs.Tab>
          <Tabs.Tab
            className={classes.flex}
            styles={{ tabLabel: { minWidth: 0 } }}
            id="imagesTab"
            value="imagesTab">
            <IconPhoto />
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

// function load_frame(dicturl, text) {
//   // if (contentLoaded) {
//   //   console.log(`${label} content already loaded.`);
//   //   return;
//   // }

//   let url = getLookupURL(dicturl, text);

//   const is_bing = dicturl.indexOf("www.bing.com") != -1;
//   if (is_bing) {
//     // TODO handle_image_lookup_separately: don't mix term lookups with image lookups.
//     let use_text = text;
//     const binghash = dicturl.replace("https://www.bing.com/images/search?", "");
//     url = `/bing/search/${LANG_ID}/${encodeURIComponent(use_text)}/${encodeURIComponent(binghash)}`;
//   }

//   // contentLoaded = true;
//   return url;
// }

function getLookupURL(dictURL, term) {
  let url = dictURL;
  // Terms are saved with zero-width space between each token;
  // remove that for dict searches.
  const zeroWidthSpace = "\u200b";
  const sqlZWS = "%E2%80%8B";
  const cleantext = term.replaceAll(zeroWidthSpace, "").replace(/\s+/g, " ");
  const searchterm = encodeURIComponent(cleantext).replaceAll(sqlZWS, "");
  url = url.replace("###", searchterm);

  return url;
}

function handleExternal(url) {
  let settings =
    "width=800, height=600, scrollbars=yes, menubar=no, resizable=yes, status=no";
  // if (newTab) settings = null;
  window.open(url, "otherwin", settings);
}

export default memo(DictPane);
