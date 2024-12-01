import {
  ActionIcon,
  Checkbox,
  Group,
  NativeSelect,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconExternalLink,
  IconGripVertical,
  IconSquareRoundedMinusFilled,
} from "@tabler/icons-react";

function DictionaryBar({ form, index }) {
  return (
    <Group gap="xs" wrap="nowrap" justify="space-between">
      <ActionIcon variant="transparent" c="dark">
        <IconGripVertical />
      </ActionIcon>

      <Tooltip label="Is active?" openDelay={300} withinPortal={false}>
        <Checkbox
          size="xs"
          disabled={form.getValues().dictionaries.length > 2 ? false : true}
          key={form.key(`dictionaries.${index}.active`)}
          {...form.getInputProps(`dictionaries.${index}.active`, {
            type: "checkbox",
          })}
        />
      </Tooltip>

      <TextInput
        flex={5}
        size="xs"
        placeholder="Dictionary URL"
        rightSection={
          form.getValues().dictionaries[index].url.length > 0 ? (
            <Tooltip label="Test dictionary" openDelay={300}>
              <ActionIcon variant="transparent" size="sm">
                <IconExternalLink />
              </ActionIcon>
            </Tooltip>
          ) : null
        }
        key={form.key(`dictionaries.${index}.url`)}
        {...form.getInputProps(`dictionaries.${index}.url`)}
      />

      <Tooltip label="Use for" openDelay={300} withinPortal={false}>
        <NativeSelect
          aria-label="Use dictionary for"
          size="xs"
          data={[
            { label: "Terms", value: "terms" },
            { label: "Sentences", value: "sentences" },
          ]}
          key={form.key(`dictionaries.${index}.for`)}
          {...form.getInputProps(`dictionaries.${index}.for`)}
        />
      </Tooltip>

      <Tooltip label="Show as" openDelay={300} withinPortal={false}>
        <NativeSelect
          aria-label="Show dictionary as"
          size="xs"
          data={[
            { label: "Embedded", value: "embedded" },
            { label: "Pop-up", value: "popup" },
          ]}
          key={form.key(`dictionaries.${index}.type`)}
          {...form.getInputProps(`dictionaries.${index}.type`)}
        />
      </Tooltip>

      <Tooltip label="Remove dictionary" openDelay={300} withinPortal={false}>
        <ActionIcon
          disabled={form.getValues().dictionaries.length > 2 ? false : true}
          variant="transparent"
          color="red.6"
          size="sm"
          style={{ backgroundColor: "transparent" }}
          onClick={() =>
            form.getValues().dictionaries.length > 2 &&
            form.removeListItem("dictionaries", index)
          }>
          <IconSquareRoundedMinusFilled />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

export default DictionaryBar;
