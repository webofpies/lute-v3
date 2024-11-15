import { Fragment, memo } from "react";
import { ActionIcon, Divider, Paper, Stack, Tooltip } from "@mantine/core";
import classes from "./Toolbar.module.css";
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
  adjustFontSize,
  adjustLineHeight,
  setColumnCount,
} from "../../misc/textActions";

function Toolbar({ dispatch }) {
  const toolbarButtons = [
    [
      {
        label: "Descrease font size",
        icon: IconTextDecrease,
        action: () => adjustFontSize(-1),
      },
      {
        label: "Increase font size",
        icon: IconTextIncrease,
        action: () => adjustFontSize(1),
      },
    ],
    [
      {
        label: "Descrease line height",
        icon: IconBaselineDensityMedium,
        action: () => adjustLineHeight(-0.1),
      },
      {
        label: "Increase line height",
        icon: IconBaselineDensitySmall,
        action: () => adjustLineHeight(0.1),
      },
    ],
    [
      {
        label: "Set columns to 1",
        icon: IconColumns1,
        action: () => setColumnCount(1),
      },
      {
        label: "Set columns to 2",
        icon: IconColumns2,
        action: () => setColumnCount(2),
      },
    ],
    [
      {
        label: "Decrease pane width",
        icon: IconLayoutSidebarRightExpand,
        action: () => dispatch({ type: "adjustWidth", payload: 0.95 }),
      },
      {
        label: "Increase pane width",
        icon: IconLayoutSidebarLeftExpand,
        action: () => dispatch({ type: "adjustWidth", payload: 1.05 }),
      },
    ],
  ];

  return (
    <Paper shadow="lg" withBorder className={classes.toolbar}>
      <Stack wrap="no-wrap" gap={5} align="center">
        {toolbarButtons.map((buttonGrp, index) => (
          <Fragment key={index}>
            <ActionIcon.Group orientation="horizontal">
              {buttonGrp.map((button) => {
                const Icon = button.icon;
                return (
                  <Tooltip
                    key={button.label}
                    position="right"
                    label={button.label}>
                    <ActionIcon size="1.6rem" onClick={button.action}>
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

export default memo(Toolbar);
