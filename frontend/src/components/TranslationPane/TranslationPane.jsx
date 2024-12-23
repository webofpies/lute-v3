import { memo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mantine/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DictTabs from "../DictTabs/DictTabs";
import TermForm from "../TermForm/TermForm";
import classes from "../BookView/BookView.module.css";
import { paneResizeStorage } from "../../misc/utils";
import { termDataQuery } from "../../queries/term";

function TranslationPane({ book, termData, onSetActiveTerm }) {
  const termPanelRef = useRef();
  const translationFieldRef = useRef();

  const key =
    termData.type === "multi"
      ? `${termData.data}/${termData.langID}`
      : termData.data;

  const { isSuccess, data, error } = useQuery(termDataQuery(key));

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
            <TermForm
              key={data.text}
              termData={data}
              book={book}
              translationFieldRef={translationFieldRef}
              onSetActiveTerm={onSetActiveTerm}
            />
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
              translationFieldRef={translationFieldRef}
            />
          </Panel>
        </PanelGroup>
      )}
    </Stack>
  );
}

export default memo(TranslationPane);
