import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Group, Radio, rem, ScrollArea } from "@mantine/core";
import LanguageCard from "../LanguageCard/LanguageCard";
import { definedListQueryObj } from "../../queries/language";
import classes from "../LanguageCard/LanguageCard.module.css";

function LanguageCards({ label, description }) {
  const { data: languages } = useQuery(definedListQueryObj());
  const [params, setParams] = useSearchParams();
  const lang = params.get("def");

  return (
    <Radio.Group
      styles={{ description: { marginBottom: rem(5) } }}
      label={label}
      description={description}
      name="langs"
      value={lang ? lang : null}
      onChange={(language) => setParams({ def: language })}>
      <ScrollArea type="scroll" offsetScrollbars="x">
        <Group gap={2} wrap="nowrap">
          {languages
            .toSorted((a, b) => a.name.localeCompare(b.name))
            .map((data) => (
              <Radio.Card
                key={data.id}
                value={data.name}
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
