import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Group, Radio, rem, ScrollArea } from "@mantine/core";
import LanguageCard from "../LanguageCard/LanguageCard";
import { definedListQuery } from "../../queries/language";
import classes from "../LanguageCard/LanguageCard.module.css";

function LanguageCards({ label, description }) {
  const { data: languages } = useQuery(definedListQuery);
  const [params, setParams] = useSearchParams();
  const name = params.get("name");

  function handleLanguageChange(language) {
    const obj = JSON.parse(language);
    if (obj.name === name) {
      return;
    }
    setParams({ name: obj.name, id: obj.id });
  }

  return (
    <Radio.Group
      styles={{ description: { marginBottom: rem(5) } }}
      label={label}
      description={description}
      name="langs"
      value={JSON.stringify({ name: name, id: params.get("id") })}
      onChange={handleLanguageChange}>
      <ScrollArea type="scroll" offsetScrollbars="x">
        <Group gap={2} wrap="nowrap" align="stretch">
          {languages
            .toSorted((a, b) => a.name.localeCompare(b.name))
            .map((data) => (
              <Radio.Card
                key={data.id}
                value={JSON.stringify({ name: data.name, id: String(data.id) })}
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

export default LanguageCards;
