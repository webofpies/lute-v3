import { Group, rem, Text, ThemeIcon } from "@mantine/core";
import {
  IconCheck,
  IconMinus,
  IconNumber0,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber5,
} from "@tabler/icons-react";
import statusLabels from "../../misc/statusLabels";

function StatusCell({ row }) {
  let icon;

  switch (row.original.statusId) {
    case 0:
      icon = <IconNumber0 color="var(--lute-text-color-status0)" size="80%" />;
      break;
    case 1:
      icon = <IconNumber1 color="var(--lute-text-color-status1)" size="80%" />;
      break;
    case 2:
      icon = <IconNumber2 color="var(--lute-text-color-status2)" size="80%" />;
      break;
    case 3:
      icon = <IconNumber3 color="var(--lute-text-color-status3)" size="80%" />;
      break;
    case 4:
      icon = <IconNumber4 color="var(--lute-text-color-status4)" size="80%" />;
      break;
    case 5:
      icon = <IconNumber5 color="var(--lute-text-color-status5)" size="80%" />;
      break;
    case 98:
      icon = <IconMinus color="var(--lute-text-color-status98)" size="80%" />;
      break;
    case 99:
      icon = <IconCheck color="var(--lute-text-color-status99)" size="80%" />;
      break;
  }

  return (
    <Group gap={6}>
      <ThemeIcon
        variant="filled"
        size={rem(20)}
        radius="50%"
        color={`var(--lute-color-highlight-status${row.original.statusId}`}>
        {icon}
      </ThemeIcon>
      <Text size="sm">{statusLabels[row.original.statusId]}</Text>
    </Group>
  );
}

export default StatusCell;
