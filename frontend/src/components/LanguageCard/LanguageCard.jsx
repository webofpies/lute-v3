import { Group, Stack, Text } from "@mantine/core";
import classes from "./LanguageCard.module.css";

export function LanguageCard({ data }) {
  return (
    <Stack gap="xs">
      <Text fz="sm" className={classes.label} lh={1.2} fw={500} lineClamp={1}>
        {data.name}
      </Text>
      <Group wrap="nowrap">
        <div>
          <Text fz="xs" fw={500} className={classes.label}>
            {data.bookCount}
          </Text>
          <Text size="xs" fw={500} className={classes.stat}>
            Books
          </Text>
        </div>
        <div>
          <Text fz="xs" fw={500} className={classes.label}>
            {data.termCount}
          </Text>
          <Text size="xs" fw={500} className={classes.stat}>
            Terms
          </Text>
        </div>
      </Group>
    </Stack>
  );
}

export default LanguageCard;
