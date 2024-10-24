/* eslint-disable react/prop-types */
import { ActionIcon, Tooltip } from "@mantine/core";

export default function DrawerButtonGrp({ tooltip, icons }) {
  return (
    <Tooltip label={tooltip}>
      <ActionIcon.Group>
        {icons.map((Icon, index) => {
          return (
            <ActionIcon key={index} variant="light" size="lg">
              <Icon style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          );
        })}
      </ActionIcon.Group>
    </Tooltip>
  );
}
