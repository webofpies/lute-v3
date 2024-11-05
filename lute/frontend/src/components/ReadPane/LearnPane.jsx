import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Divider, LoadingOverlay, Stack } from "@mantine/core";
import { useMouse } from "@mantine/hooks";
import { clamp } from "../../misc/utils";
import DictPane from "../DictPane/DictPane";
import TermForm from "../TermForm/TermForm";
import styles from "./ReadPane.module.css";

function LearnPane({ book, termData }) {
  const { isFetching, isSuccess, data, error } = useFetchTerm(termData);
  const [height, setHeight] = useState(50);
  const termFormRef = useRef();
  const dictPaneRef = useRef();

  const { ref, y } = useMouse();

  function handleResize(e) {
    e.preventDefault();
    termFormRef.current.style.pointerEvents = "none";
    dictPaneRef.current.style.pointerEvents = "none";

    const containerHeight = parseFloat(
      window.getComputedStyle(ref.current).getPropertyValue("height")
    );

    function resize(e) {
      const delta = y - e.clientY;
      const ratioInPct = (delta / containerHeight) * 100;
      const newHeight = height - ratioInPct;
      setHeight(clamp(newHeight, 5, 95));
    }

    ref.current.addEventListener("mousemove", resize);

    ref.current.addEventListener("mouseup", () => {
      ref.current.removeEventListener("mousemove", resize);
      termFormRef.current.style.pointerEvents = "unset";
      dictPaneRef.current.style.pointerEvents = "unset";
    });
  }

  if (error) return "An error has occurred: " + error.message;

  return (
    <Stack
      ref={ref}
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
          <div ref={termFormRef} style={{ height: `${height}%` }}>
            {/* need key to recreate the form */}
            <TermForm key={data.text} termData={data} />
          </div>
          <Divider
            style={{
              cursor: "ns-resize",
              backgroundColor: "var(--mantine-color-blue-filled)",
            }}
            styles={{ root: { height: "6px", border: "none", zIndex: 1 } }}
            orientation="horizontal"
            onMouseDown={handleResize}
          />
          <div ref={dictPaneRef} className={styles.dictPane}>
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

export default LearnPane;
