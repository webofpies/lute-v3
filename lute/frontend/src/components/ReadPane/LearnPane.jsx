import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Divider, LoadingOverlay, Stack } from "@mantine/core";
import { useMouse } from "@mantine/hooks";
import { clamp } from "../../utils";
import DictPane from "../DictPane/DictPane";
import TermForm from "../TermForm/TermForm";

function LearnPane({ book, termData }) {
  const { isFetching, isSuccess, data, error } = useFetchTerm(termData);
  const [height, setHeight] = useState(50);
  const { ref, y } = useMouse();

  function handleResize(e) {
    e.preventDefault();
    ref.current.style.pointerEvents = "none";

    const containerHeight = parseFloat(
      window.getComputedStyle(ref.current).getPropertyValue("height")
    );

    function resize(e) {
      const delta = y - e.clientY;
      const ratioInPct = (delta / containerHeight) * 100;
      const newHeight = height - ratioInPct;
      setHeight(clamp(newHeight, 5, 95));
    }

    document.addEventListener("mousemove", resize);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", resize);
      ref.current.style.pointerEvents = "unset";
    });
  }

  if (error) return "An error has occurred: " + error.message;

  return (
    isSuccess && (
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
        <div style={{ height: `${height}%` }}>
          <TermForm termData={data} />
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
        <DictPane term={data.text} dicts={book.term_dicts} />
      </Stack>
    )
  );
}

function useFetchTerm(termData) {
  const key = termData.multi
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
