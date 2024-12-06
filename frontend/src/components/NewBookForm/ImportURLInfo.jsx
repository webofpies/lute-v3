import { ActionIcon, Paper, Popover, rem } from "@mantine/core";
import { IconQuestionMark } from "@tabler/icons-react";

function ImportURLInfo() {
  return (
    <Popover position="top" withArrow shadow="sm">
      <Popover.Target>
        <ActionIcon variant="transparent">
          <IconQuestionMark />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Paper maw={500} fz="sm">
          <p style={{ marginBottom: rem(5) }}>
            This import is very primitive -- it grabs <em>all</em> the headings
            and text from an HTML page.
          </p>
          <p>
            This will likely include stuff you don&apos;t want. You are able to
            edit the resulting text
          </p>
        </Paper>
      </Popover.Dropdown>
    </Popover>
  );
}

export default ImportURLInfo;
