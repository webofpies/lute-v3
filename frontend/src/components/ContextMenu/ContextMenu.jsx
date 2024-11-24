import { forwardRef, Fragment, memo, useEffect, useRef, useState } from "react";
import { Affix, Menu } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { actions } from "../../misc/actionsMap";
import { addFlash, removeFlash } from "../../misc/utils";
import {
  IconClick,
  IconAlignLeft,
  IconPilcrow,
  IconClipboardCheck,
  IconClipboardText,
  IconClipboardTypography,
} from "@tabler/icons-react";

const ContextMenu = forwardRef(function ContextMenu(props, forwardedRef) {
  const [coords, setCoords] = useState({ clientX: null, clientY: null });
  const selectedTextItemRef = useRef();

  const menuRef = useClickOutside(() => {
    setCoords({ clientX: null, clientY: null });
    forwardedRef.current.removeEventListener("wheel", disableScroll);
  });

  const validCoords = coords.clientX !== null && coords.clientY !== null;

  useEffect(() => {
    const ref = forwardedRef.current;

    function handleContextMenu(e) {
      e.preventDefault();
      const { clientX, clientY } = e;
      setCoords({ clientX, clientY });
      selectedTextItemRef.current = e.target.matches(".word") ? e.target : null;
    }

    ref.addEventListener("contextmenu", handleContextMenu);
    ref.addEventListener("wheel", disableScroll);

    return () => {
      ref.removeEventListener("contextmenu", handleContextMenu);
      ref.removeEventListener("wheel", disableScroll);
    };
  });

  async function handleRightClick(item) {
    const textItemSelection = await actions[item.action](
      selectedTextItemRef.current,
      item.arg
    );

    addFlash(textItemSelection);
    setTimeout(() => removeFlash(), 1000);
  }

  function disableScroll(e) {
    if (validCoords) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <Affix
      styles={{ display: validCoords ? "initial" : "none" }}
      position={
        coords.clientX !== null && coords.clientY !== null
          ? { left: coords?.clientX, top: coords?.clientY }
          : undefined
      }>
      <Menu shadow="md" width={200} opened={validCoords} keepMounted>
        <div ref={menuRef}>
          <Menu.Target>
            <div />
          </Menu.Target>
          <Menu.Dropdown>
            {getItems().map((section) => {
              return (
                <Fragment key={section.label}>
                  <Menu.Label>{section.label}</Menu.Label>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Menu.Item
                        onClick={() => handleRightClick(item)}
                        key={item.label}
                        leftSection={<Icon size="1rem" />}>
                        {item.label}
                      </Menu.Item>
                    );
                  })}
                </Fragment>
              );
            })}
          </Menu.Dropdown>
        </div>
      </Menu>
    </Affix>
  );
});

function getItems() {
  return [
    {
      label: "Translate",
      items: [
        {
          label: "Selection",
          icon: IconClick,
          action: "translateSelection",
          arg: "",
        },
        {
          label: "Sentence",
          icon: IconAlignLeft,
          action: "translateSentence",
          arg: "sentence",
        },
        {
          label: "Paragraph",
          icon: IconPilcrow,
          action: "translateParagraph",
          arg: "paragraph",
        },
      ],
    },
    {
      label: "Copy",
      items: [
        {
          label: "Selection",
          icon: IconClipboardCheck,
          action: "copySelection",
          arg: "",
        },
        {
          label: "Sentence",
          icon: IconClipboardText,
          action: "copySentence",
          arg: "sentence",
        },
        {
          label: "Paragraph",
          icon: IconClipboardTypography,
          action: "copyParagraph",
          arg: "paragraph",
        },
        {
          label: "Page",
          icon: IconClipboardTypography,
          action: "copyParagraph",
          arg: "page",
        },
      ],
    },
  ];
}

export default memo(ContextMenu);
