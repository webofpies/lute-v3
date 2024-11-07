// lute\templates\read\page_content.html
import { memo, useEffect } from "react";
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconClipboardCheck } from "@tabler/icons-react";
import TextItemPopup from "../Popup/TextItemPopup";
import { copyToClipboard } from "../../misc/utils";
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

function TheText({ pageData, onSetActiveTerm }) {
  useEffect(() => {
    startHoverMode();
    adjustFontSize(0);
    adjustLineHeight(0);
    setColumnCount(null);
  });

  function handleSetTerm(termData) {
    // do nothing with the form
    if (!termData || termData.type === "copy") return;
    onSetActiveTerm(termData);
  }

  return (
    <div id={"thetext"}>
      {pageData.map((paragraph, index) => {
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
                  />
                ))}
              </span>
            ))}
            <span className="textitem">{"\u200B"}</span>
          </p>
        );
      })}
    </div>
  );
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

export default memo(TheText);
