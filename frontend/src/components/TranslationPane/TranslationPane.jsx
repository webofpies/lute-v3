import { memo, useRef } from "react";
import { Box, Stack } from "@mantine/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DictTabs from "../DictTabs/DictTabs";
import TermForm from "../TermForm/TermForm";
import { paneResizeStorage } from "../../misc/utils";
import classes from "../BookView/BookView.module.css";

function TranslationPane({
  term,
  language,
  onSetActiveTerm,
  onSetActiveTab,
  activeTab,
}) {
  const termPanelRef = useRef();
  const translationFieldRef = useRef();

  return (
    <Stack gap={0} dir="column" className={classes.translationContainer}>
      <PanelGroup
        direction="vertical"
        autoSaveId="Lute.verticalSize"
        storage={paneResizeStorage}>
        <Panel order={1} defaultSize={40} ref={termPanelRef}>
          {/* need key to recreate the form */}
          <Box p={20}>
            <TermForm
              key={term.text}
              term={term}
              language={language}
              translationFieldRef={translationFieldRef}
              onSetActiveTerm={onSetActiveTerm}
            />
          </Box>
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
            term={term.text}
            language={language}
            translationFieldRef={translationFieldRef}
            onSetActiveTab={onSetActiveTab}
            activeTab={activeTab}
          />
        </Panel>
      </PanelGroup>
    </Stack>
  );
}

export default memo(TranslationPane);
