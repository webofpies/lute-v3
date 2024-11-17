import { ActionIcon, Group, Paper, rem, Tooltip } from "@mantine/core";
import { IconCheck, IconChevronRight } from "@tabler/icons-react";

function ReadFooter() {
  return (
    <Paper withBorder radius={0} styles={{ root: { borderInline: "none" } }}>
      <Group justify="center" pt={rem(5)} pb={rem(5)} gap={rem(5)}>
        <Tooltip label="Mark rest as known, mark page as read, then go to next page">
          <ActionIcon size={rem(20)} color="green" variant="transparent">
            <IconCheck />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Mark page as read, then go to next page">
          <ActionIcon size={rem(20)} color="blue" variant="transparent">
            <IconChevronRight />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
}

export default ReadFooter;
