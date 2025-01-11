import { Group, Pill, PillGroup } from "@mantine/core";
import classes from "./PopupData.module.css";

function PopupDataSection({ data }) {
  return data.map((d, index) => (
    <div key={index} className={classes.section}>
      <Group gap={5} wrap="nowrap">
        <span
          className={classes.term}
          dangerouslySetInnerHTML={{
            __html: d.text,
          }}
        />
        {d.pronunciation && <em>({d.pronunciation})</em>}
        {d.tags.length > 0 && (
          <PillGroup gap={4}>
            {d.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </PillGroup>
        )}
      </Group>
      {d.translation && (
        <span
          dangerouslySetInnerHTML={{
            __html: d.translation,
          }}
        />
      )}
    </div>
  ));
}

export default PopupDataSection;
