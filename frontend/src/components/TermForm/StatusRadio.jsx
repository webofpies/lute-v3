import { Group, Radio, rem, Text } from "@mantine/core";
import { IconCheck, IconMinus } from "@tabler/icons-react";

const radioIcon = (label, props) => (
  <Text {...props} lh={1} ta="center">
    {label}
  </Text>
);

const radios = [
  {
    value: "1",
    icon: (props) => radioIcon(1, props),
  },
  {
    value: "2",
    icon: (props) => radioIcon(2, props),
  },
  {
    value: "3",
    icon: (props) => radioIcon(3, props),
  },
  {
    value: "4",
    icon: (props) => radioIcon(4, props),
  },
  {
    value: "5",
    icon: (props) => radioIcon(5, props),
  },
  {
    value: "99",
    icon: IconCheck,
  },
  {
    value: "98",
    icon: IconMinus,
  },
];

function StatusRadio({ form }) {
  const statusColor = (id) => `var(--lute-color-highlight-status${id})`;
  const iconColor = (id) => `var(--lute-text-color-status${id})`;
  return (
    <Radio.Group
      name="status"
      key={form.key("status")}
      {...form.getInputProps("status")}>
      <Group justify="flex-start" gap={2} wrap="nowrap">
        {radios.map((radio) => (
          <Radio
            style={{ "--radio-icon-size": rem(16) }}
            styles={{
              radio: {
                backgroundColor: statusColor(radio.value),
                border: "none",
              },
            }}
            iconColor={iconColor(radio.value)}
            color={statusColor(radio.value)}
            size="md"
            key={radio.value}
            icon={radio.icon}
            name={radio.value}
            value={radio.value}
            ml={radio.value === radios[radios.length - 1].value ? 10 : 0}
          />
        ))}
      </Group>
    </Radio.Group>
  );
}

export default StatusRadio;
