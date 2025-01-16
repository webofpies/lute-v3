import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Group, Radio, rem, ScrollArea, Stack, Text } from "@mantine/core";
import { definedListQuery } from "../../queries/language";
import classes from "./LanguageCards.module.css";

function LanguageCards({ label, description }) {
  const { data: languages } = useQuery(definedListQuery);
  const [params, setParams] = useSearchParams();
  const currentId = params.get("langId");

  function handleLanguageChange(id) {
    if (id === currentId) {
      return;
    }
    setParams({ langId: id });
  }

  return (
    <Radio.Group
      styles={{ description: { marginBottom: rem(5) } }}
      label={label}
      description={description}
      name="langs"
      value={currentId}
      onChange={(id) => handleLanguageChange(id)}>
      <ScrollArea type="scroll" offsetScrollbars="x">
        <Group gap={2} wrap="nowrap" align="stretch">
          {languages
            .toSorted((a, b) => a.id > b.id)
            .map((data) => (
              <Radio.Card
                key={data.id}
                value={String(data.id)}
                className={classes.card}>
                <Group wrap="nowrap" align="flex-start" gap={8}>
                  <Radio.Indicator size="xs" />
                  <LanguageCard data={data} />
                </Group>
              </Radio.Card>
            ))}
        </Group>
      </ScrollArea>
    </Radio.Group>
  );
}

function LanguageCard({ data }) {
  return (
    <Stack gap="xs">
      <Text fz="sm" className={classes.label} lh={1.4} fw={500} lineClamp={1}>
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

export default LanguageCards;
