import { Fragment, memo } from "react";
import { ActionIcon, Divider, Paper, Stack, Tooltip } from "@mantine/core";
import classes from "./Toolbar.module.css";
import { toolbarButtons } from "../../misc/menus";
import { actions } from "../../misc/actionsMap";

function Toolbar() {
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
                    <ActionIcon size="1.7rem" onClick={actions[button.action]}>
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
