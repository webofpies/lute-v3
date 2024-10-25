// lute\templates\read\page_content.html
import { memo, useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Box, LoadingOverlay, Title } from "@mantine/core";
import TextSkeleton from "./TextSkeleton";
import TextItemPopup from "../Popup/TextItemPopup";
// import TextItem from "./TextItem";
import {
  startHoverMode,
  hoverOut,
  hoverOver,
  selectionStarted,
  selectionOver,
  selectEnded,
  selectedMultiTerm,
} from "../../lute";
import {
  adjustFontSize,
  adjustLineHeight,
  setColumnCount,
} from "../../textOptions";

function TheText({ book, page, highlightsOn, onSetActiveTerm }) {
  const { isPending, isFetching, isSuccess, error, data } = useQuery({
    queryKey: ["pageData", book.id, page],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/read/${book.id}/${page}/pageinfo`
      );
      return await response.json();
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess) {
      startHoverMode();
      adjustFontSize(0);
      adjustLineHeight(0);
      setColumnCount(null);
    }
  });

  if (isPending) return <TextSkeleton />;
  if (error) return "An error has occurred: " + error.message;

  function handleSetTerm(textitem) {
    const termID = textitem.wid;

    onSetActiveTerm((prev) => {
      if (prev.data === termID) {
        return { data: null };
      }

      if (selectedMultiTerm.text) {
        return {
          data: selectedMultiTerm.text,
          multi: true,
          langID: selectedMultiTerm.langID,
        };
      } else {
        return {
          data: termID,
          multi: false,
        };
      }
    });
  }

  return (
    <>
      <Box pos="relative" h="100%">
        {page === 1 && (
          <Title
            style={{ overflowWrap: "break-word" }}
            size="xl"
            mb="lg"
            dir={book.is_rtl ? "rtl" : ""}>
            {book.title}
          </Title>
        )}
        <LoadingOverlay
          visible={isFetching}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 0 }}
        />
        <div id={"thetext"} style={{ textAlign: "left" }}>
          {data.map((paragraph, index) => {
            return (
              <p key={index} className="textparagraph">
                {paragraph.map((sentence, index) => (
                  <span
                    key={`sent_${index + 1}`}
                    className="textsentence"
                    id={`sent_${index + 1}`}>
                    {sentence.map((textitem) => (
                      <TextItemPopup
                        onMouseDown={selectionStarted}
                        onMouseUp={(e) => {
                          selectEnded(e);
                          handleSetTerm(textitem);
                        }}
                        onMouseOver={(e) => {
                          selectionOver(e);
                          hoverOver(e);
                        }}
                        onMouseOut={hoverOut}
                        key={textitem.id}
                        data={textitem}
                        highlightsOn={highlightsOn}
                      />
                    ))}
                  </span>
                ))}
                <span className="textitem">{"\u200B"}</span>
              </p>
            );
          })}
        </div>
      </Box>
    </>
  );
}

export default memo(TheText);
