// lute\templates\read\termpopup.html

import { Group, Pill, PillGroup, Tooltip } from "@mantine/core";
import PopupDataSection from "./PopupDataSection";
import classes from "./PopupData.module.css";

export default function PopupData({ data }) {
  return (
    data && (
      <div className={classes.container}>
        <Group gap={5} wrap="nowrap">
          <span className={classes.term}>
            {data.term.text} {data.parentTerms && `(${data.parentTerms})`}
          </span>
          {data.tags.length > 0 && (
            <PillGroup gap={4}>
              {data.tags.map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </PillGroup>
          )}
        </Group>
        {data.term.romanization && <em>{data.term.romanization}</em>}
        {Object.entries(data.images).map(([img, tooltip]) => (
          <Tooltip key={img} label={tooltip}>
            <img
              className={classes.image}
              src={`http://localhost:5001${img}`}
            />
          </Tooltip>
        ))}
        {data.translation && (
          <p className={classes.translation}>{data.translation}</p>
        )}

        {data.parentData.length > 0 && (
          <PopupDataSection data={data.parentData} />
        )}

        {data.componentData.length > 0 && (
          <>
            <p>Components</p>
            <PopupDataSection data={data.componentData} />
          </>
        )}
      </div>
    )
  );
}
