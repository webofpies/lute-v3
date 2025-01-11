// lute\templates\read\termpopup.html

import { Group, Pill, PillGroup, Text, Tooltip } from "@mantine/core";
import PopupDataSection from "./PopupDataSection";
import classes from "./PopupData.module.css";

export default function PopupData({ data }) {
  return (
    data && (
      <div className={classes.container}>
        <Group gap={5} wrap="nowrap">
          <span className={classes.term}>{data.text}</span>
          {data.tags.length > 0 && (
            <PillGroup gap={4}>
              {data.tags.map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </PillGroup>
          )}
        </Group>

        {data.pronunciation && <em>{data.pronunciation}</em>}

        {Object.entries(data.images).map(([img, tooltip]) => (
          <Tooltip key={img} label={tooltip}>
            <img
              className={classes.image}
              src={`http://localhost:5001${img}`}
            />
          </Tooltip>
        ))}

        {data.translation && (
          <p
            className={classes.translation}
            dangerouslySetInnerHTML={{
              __html: data.translation,
            }}
          />
        )}

        {data.parents.length > 0 && <PopupDataSection data={data.parents} />}

        {data.components.length > 0 && (
          <>
            <Text component="p" mt="sm" fs="italic">
              Components
            </Text>
            <PopupDataSection data={data.components} />
          </>
        )}
      </div>
    )
  );
}
