import { memo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingOverlay, Stack } from "@mantine/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DictPane from "../DictPane/DictPane";
import TermForm from "../TermForm/TermForm";
import styles from "./ReadPane.module.css";
import { paneResizeStorage } from "../../misc/utils";

function LearnPane({ book, termData }) {
  const termPanelRef = useRef();
  const { isFetching, isSuccess, data, error } = useFetchTerm(termData);
  if (error) return "An error has occurred: " + error.message;

  return (
    <Stack
      gap={0}
      dir="column"
      style={{ position: "relative", height: "100%" }}>
      <LoadingOverlay
        visible={isFetching}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
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
            className={styles.resizeHandle}
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
            className={styles.dictPane}>
            <DictPane term={data.text} dicts={book.dictionaries.term} />
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
    // enabled: !termData.multi && !!termData.data,
    // staleTime: Infinity, // relicking the same work opens an empty form
  });
}

export default memo(LearnPane);
