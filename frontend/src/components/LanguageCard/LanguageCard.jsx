import { useSearchParams } from "react-router-dom";
import { Group, Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import classes from "./LanguageCard.module.css";

export function LanguageCard({ data }) {
  const theme = useMantineTheme();
  const [params, setParams] = useSearchParams();
  return (
    <Paper
      onClick={() => setParams({ def: data.name })}
      component="a"
      withBorder
      radius="sm"
      className={`${theme.activeClassName} ${classes.card} ${params.get("def") === data.name ? classes.active : ""}`}>
      <Stack>
        <Text fz="lg" className={classes.label} lh={1} fw={500}>
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
    </Paper>
  );
}

export default LanguageCard;
