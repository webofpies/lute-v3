import { Fragment, memo, useState } from "react";
import { ActionIcon, Divider, Group, Paper, Tooltip } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import {
  IconBaselineDensityMedium,
  IconBaselineDensitySmall,
  IconColumns1,
  IconColumns2,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightExpand,
  IconTextDecrease,
  IconTextIncrease,
} from "@tabler/icons-react";
import {
  handleSetColumnCount,
  handleSetLineHeight,
  handleSetFontSize,
  handleSetTextWidth,
} from "@actions/page";
import classes from "./Toolbar.module.css";

function Toolbar({ state, dispatch }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  const toolbarButtons = getToolbarButtons(state, dispatch);

  return (
    <Paper
      ref={ref}
      shadow="sm"
      withBorder
      style={{ translate: open ? "0 100%" : "0 5px" }}
      className={classes.toolbar}
      classNames={{ root: "readpage" }}
      onClick={() => setOpen((v) => !v)}>
      <Group wrap="no-wrap" gap={5} align="center" justify="center">
        {toolbarButtons.map((buttonGrp, index) => (
          <Fragment key={index}>
            <ActionIcon.Group orientation="horizontal">
              {buttonGrp.map((button) => {
                const Icon = button.icon;
                return (
                  <Tooltip key={button.label} label={button.label}>
                    <ActionIcon
                      disabled={
                        index === toolbarButtons.length - 1 && !state.focusMode
                      }
                      size="1.4rem"
                      onClick={(e) => {
                        e.stopPropagation();
                        button.action();
                      }}>
                      <Icon className={classes.icon} />
                    </ActionIcon>
                  </Tooltip>
                );
              })}
            </ActionIcon.Group>

            {index !== toolbarButtons.length - 1 && (
              <Divider size="xs" orientation="vertical" />
            )}
          </Fragment>
        ))}
      </Group>
    </Paper>
  );
}

function getToolbarButtons(state, dispatch) {
  return [
    [
      {
        label: "Descrease font size",
        icon: IconTextDecrease,
        action: () => handleSetFontSize(state.fontSize - 0.1, dispatch),
      },
      {
        label: "Increase font size",
        icon: IconTextIncrease,
        action: () => handleSetFontSize(state.fontSize + 0.1, dispatch),
      },
    ],
    [
      {
        label: "Descrease line height",
        icon: IconBaselineDensityMedium,
        action: () => handleSetLineHeight(state.lineHeight - 1, dispatch),
      },
      {
        label: "Increase line height",
        icon: IconBaselineDensitySmall,
        action: () => handleSetLineHeight(state.lineHeight + 1, dispatch),
      },
    ],
    [
      {
        label: "Set columns to 1",
        icon: IconColumns1,
        action: () => handleSetColumnCount(1, dispatch),
      },
      {
        label: "Set columns to 2",
        icon: IconColumns2,
        action: () => handleSetColumnCount(2, dispatch),
      },
    ],
    [
      {
        label: "Decrease text width (focus mode)",
        icon: IconLayoutSidebarRightExpand,
        action: () => handleSetTextWidth(state.textWidth * 0.95, dispatch),
      },
      {
        label: "Increase text width (focus mode)",
        icon: IconLayoutSidebarLeftExpand,
        action: () => handleSetTextWidth(state.textWidth * 1.05, dispatch),
      },
    ],
  ];
}

export default memo(Toolbar);
