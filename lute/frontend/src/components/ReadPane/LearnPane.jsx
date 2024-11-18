import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Divider, LoadingOverlay, Stack } from "@mantine/core";
import DictPane from "../DictPane/DictPane";
import TermForm from "../TermForm/TermForm";
import styles from "./ReadPane.module.css";

function LearnPane({
  height,
  onSetHeight,
  dividerHClickedRef,
  mousePosRef,
  termFormRef,
  book,
  termData,
}) {
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
        <>
          <div
            ref={termFormRef}
            style={{ height: `${height}%` }}
            className="paneTerm">
            {/* need key to recreate the form */}
            <TermForm key={data.text} termData={data} />
          </div>
          <Divider
            ref={dividerHClickedRef}
            className={styles.hdivider}
            styles={{ root: { height: "8px", border: "none" } }}
            orientation="horizontal"
            onMouseDown={() => (dividerHClickedRef.current = true)}
            onMouseUp={() => {
              dividerHClickedRef.current = false;
              onSetHeight(mousePosRef.current.y);
            }}
            onDoubleClick={() => {
              height < 50 ? onSetHeight(5) : onSetHeight(50);
            }}
          />
          <div className={styles.dictPane}>
            <DictPane term={data.text} dicts={book.dictionaries.term} />
          </div>
        </>
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
      const response = await fetch(`http://localhost:5001/read/terms/${key}`);
      return await response.json();
    },
    refetchOnWindowFocus: false,
    // enabled: !termData.multi && !!termData.data,
    // staleTime: Infinity, // relicking the same work opens an empty form
  });
}

export default memo(LearnPane);
