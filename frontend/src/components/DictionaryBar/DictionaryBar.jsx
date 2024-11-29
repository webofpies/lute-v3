import {
  ActionIcon,
  Checkbox,
  Group,
  Select,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconExternalLink,
  IconGripVertical,
  IconSquareRoundedMinusFilled,
} from "@tabler/icons-react";

function DictionaryBar({ onRemove }) {
  return (
    <Group gap="xs" wrap="nowrap" justify="space-between">
      <IconGripVertical />
      <TextInput flex={5} size="xs" placeholder="Dictionary URL" />
      <Tooltip label="Use for" openDelay={300}>
        <Select
          size="xs"
          flex={1}
          withCheckIcon={false}
          allowDeselect={false}
          defaultValue="Terms"
          data={["Terms", "Sentences"]}
        />
      </Tooltip>
      <Tooltip label="Show as" openDelay={300}>
        <Select
          size="xs"
          flex={1}
          withCheckIcon={false}
          allowDeselect={false}
          defaultValue="Embedded"
          data={["Embedded", "Pop-up"]}
        />
      </Tooltip>

      <Tooltip label="Is active?" openDelay={300}>
        <Checkbox size="sm" />
      </Tooltip>
      <Tooltip label="Test dictionary" openDelay={300}>
        <ActionIcon variant="transparent" size="sm">
          <IconExternalLink />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Remove dictionary" openDelay={300}>
        <ActionIcon
          variant="transparent"
          color="red.6"
          size="sm"
          onClick={onRemove}>
          <IconSquareRoundedMinusFilled />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

export default DictionaryBar;
