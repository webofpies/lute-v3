import { Group, Pill, PillGroup } from "@mantine/core";
import classes from "./PopupData.module.css";

function PopupDataSection({ data }) {
  return data.map((p, index) => (
    <div key={index} className={classes.section}>
      <Group gap={5} wrap="nowrap">
        <span className={classes.term}>{p.term}</span>
        {p.roman && <em>({p.roman})</em>}
        {p.tags.length > 0 && (
          <PillGroup gap={4}>
            {p.tags.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </PillGroup>
        )}
      </Group>
      <span>{p.trans}</span>
    </div>
  ));
}

export default PopupDataSection;
