// lute\templates\read\page_content.html
import { memo, useRef } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Box, LoadingOverlay, Title } from "@mantine/core";
import TextSkeleton from "./TextSkeleton";
import TextItemPopup from "../Popup/TextItemPopup";
import TextItem from "./TextItem";
import { createInteractionFunctions } from "../../lute";

function TheText({ book, page, highlightsOn, activeTerm, onSetActiveTerm }) {
  const selectionStartRef = useRef(null);
  const currentTermDataOrderRef = useRef(-1);
  const selectedMultiTermRef = useRef({});

  const {
    isPending,
    isFetching,
    error,
    data,
    // isPlaceholderData,
    // isSuccess,
  } = useQuery({
    queryKey: ["pageData", book.id, page],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5000/read/${book.id}/${page}/pageinfo`
      );
      return await response.json();
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  if (isPending) return <TextSkeleton />;
  if (error) return "An error has occurred: " + error.message;

  const { hoverOut, hoverOver, selectionStarted, selectionOver, selectEnded } =
    createInteractionFunctions(
      selectionStartRef,
      currentTermDataOrderRef,
      selectedMultiTermRef
    );

  function handleSetTerm(e, textitem) {
    const termID = textitem["data-wid"];
    if (selectedMultiTermRef.current.text) {
      onSetActiveTerm({
        data: selectedMultiTermRef.current.text,
        multi: true,
        langID: selectedMultiTermRef.current.langID,
      });
    } else {
      if (termID && activeTerm.data === termID) {
        onSetActiveTerm({ data: null, multi: false });
      } else {
        onSetActiveTerm({ data: termID, multi: false });
      }
    }
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
              <p key={index}>
                {paragraph.map((sentence) => (
                  <span
                    key={`sent_${sentence.sentence_id}`}
                    className="textsentence"
                    id={`sent_${sentence.sentence_id}`}>
                    {sentence.textitems.map((textitem) =>
                      textitem.class.includes("word") ? (
                        <TextItemPopup
                          onMouseDown={selectionStarted}
                          onMouseUp={(e) => {
                            selectEnded(e);
                            handleSetTerm(e, textitem);
                          }}
                          onMouseOver={(e) => {
                            selectionOver(e);
                            hoverOver(e);
                          }}
                          onMouseOut={hoverOut}
                          key={textitem.id}
                          textitem={textitem}
                          highlightsOn={highlightsOn}
                        />
                      ) : (
                        // non-word spans
                        <TextItem
                          key={textitem.id}
                          data={textitem}
                          highlightsOn={highlightsOn}
                        />
                      )
                    )}
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
