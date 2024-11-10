import { Fragment, memo } from "react";
import { ActionIcon, Divider, Paper, Stack, Tooltip } from "@mantine/core";
import classes from "./Toolbar.module.css";
import { actions } from "../../misc/actionsMap";
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

function Toolbar() {
  const toolbarButtons = getButtons();

  return (
    <Paper shadow="lg" withBorder className={classes.toolbar}>
      <Stack wrap="no-wrap" gap={5} align="center">
        {toolbarButtons.map((buttonGrp, index) => (
          <Fragment key={index}>
            <ActionIcon.Group orientation="vertical">
              {buttonGrp.map((button) => {
                const Icon = button.icon;
                return (
                  <Tooltip
                    key={button.label}
                    position="right"
                    label={button.label}>
                    <ActionIcon
                      size="1.7rem"
                      onClick={() => actions[button.action](button.arg)}>
                      <Icon className={classes.icon} />
                    </ActionIcon>
                  </Tooltip>
                );
              })}
            </ActionIcon.Group>

            {index !== toolbarButtons.length - 1 && (
              <Divider size="xs" orientation="horizontal" w="100%" />
            )}
          </Fragment>
        ))}
      </Stack>
    </Paper>
  );
}

function getButtons() {
  return [
    [
      {
        label: "Descrease font size",
        icon: IconTextDecrease,
        action: "fontSizeDecrease",
        arg: -1,
      },
      {
        label: "Increase font size",
        icon: IconTextIncrease,
        action: "fontSizeIncrease",
        arg: 1,
      },
    ],
    [
      {
        label: "Descrease line height",
        icon: IconBaselineDensityMedium,
        action: "lineHeightDecrease",
        arg: -0.1,
      },
      {
        label: "Increase line height",
        icon: IconBaselineDensitySmall,
        action: "lineHeightIncrease",
        arg: 0.1,
      },
    ],
    [
      {
        label: "Set columns to 1",
        icon: IconColumns1,
        action: "setColumnCountOne",
        arg: 1,
      },
      {
        label: "Set columns to 2",
        icon: IconColumns2,
        action: "setColumnCountTwo",
        arg: 2,
      },
    ],
    [
      {
        label: "Decrease pane width",
        icon: IconLayoutSidebarRightExpand,
        action: "paneWidthDecrease",
        arg: 0.95,
      },
      {
        label: "Increase pane width",
        icon: IconLayoutSidebarLeftExpand,
        action: "paneWidthIncrease",
        arg: 1.05,
      },
    ],
  ];
}

export default memo(Toolbar);
