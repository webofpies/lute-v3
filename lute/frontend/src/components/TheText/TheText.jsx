// lute\templates\read\page_content.html
import { memo, useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Box, LoadingOverlay, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconClipboardCheck } from "@tabler/icons-react";
import TextSkeleton from "./TextSkeleton";
import TextItemPopup from "../Popup/TextItemPopup";
import {
  startHoverMode,
  hoverOut,
  handleMouseDown,
  handleMouseOver,
  handleMouseUp,
} from "../../lute";
import {
  adjustFontSize,
  adjustLineHeight,
  setColumnCount,
} from "../../misc/textOptions";
import { copyToClipboard } from "../../misc/utils";

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

  function handleSetTerm(termData) {
    // do nothing with the form
    if (!termData || termData.type === "copy") return;
    onSetActiveTerm(termData);
  }

  async function handleCopyText(termData) {
    if (termData.type !== "copy") return;

    const text = await copyToClipboard(termData.data);
    text &&
      notifications.show({
        title: "Selection copied to clipboard!",
        message: (
          <Text component="p" lineClamp={2} fz="xs">
            {termData.data}
          </Text>
        ),
        position: "bottom-center",
        autoClose: 2000,
        withCloseButton: false,
        withBorder: true,
        icon: <IconClipboardCheck />,
        color: "green",
      });
  }

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={isFetching}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 0 }}
        />
        <div id={"thetext"}>
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
                        onMouseDown={handleMouseDown}
                        onMouseUp={(e) => {
                          const termData = handleMouseUp(e);
                          handleSetTerm(termData);
                          handleCopyText(termData);
                        }}
                        onMouseOver={handleMouseOver}
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
