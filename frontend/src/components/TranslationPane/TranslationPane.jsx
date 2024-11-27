import { memo, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Stack } from "@mantine/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DictTabs from "../DictTabs/DictTabs";
import TermForm from "../TermForm/TermForm";
import classes from "../BookView/BookView.module.css";
import { paneResizeStorage } from "../../misc/utils";

function TranslationPane({ book, termData }) {
  const termPanelRef = useRef();
  const { isSuccess, data, error } = useFetchTerm(termData);
  const [activeTab, setActiveTab] = useState("0");

  if (error) return "An error has occurred: " + error.message;

  return (
    <Stack gap={0} dir="column" className={classes.translationContainer}>
      {isSuccess && (
        <PanelGroup
          direction="vertical"
          autoSaveId="Lute.verticalSize"
          storage={paneResizeStorage}>
          <Panel order={1} defaultSize={40} ref={termPanelRef}>
            {/* need key to recreate the form */}
            <TermForm key={data.text} termData={data} />
          </Panel>

          <PanelResizeHandle
            hitAreaMargins={{ coarse: 10, fine: 10 }}
            className={classes.resizeHandle}
            onDoubleClick={() => {
              const panel = termPanelRef.current;
              if (panel) {
                panel.getSize() < 15 ? panel.resize(40) : panel.resize(5);
              }
            }}
          />

          <Panel
            order={1}
            defaultSize={60}
            minSize={20}
            collapsible
            collapsedSize={0}
            className={classes.dictTabsContainer}>
            <DictTabs
              term={data.text}
              dicts={book.dictionaries.term}
              langId={book.languageId}
              activeTab={activeTab}
              onSetActiveTab={setActiveTab}
            />
          </Panel>
        </PanelGroup>
      )}
    </Stack>
  );
}

function useFetchTerm(termData) {
  const key =
    termData.type === "multi"
      ? `${termData.langID}/${termData.data}`
      : termData.data;

  return useQuery({
    queryKey: ["termData", key],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/api/terms/${key}`);
      return await response.json();
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}

export default memo(TranslationPane);
