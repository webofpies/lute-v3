import { ActionIcon, Menu, Paper, rem, TextInput } from "@mantine/core";
import { useField } from "@mantine/form";
import { IconBookmarksFilled, IconCheck } from "@tabler/icons-react";

function PageActionsMenu() {
  const field = useField({
    initialValue: "",
    validate: (value) =>
      value.trim().length < 1 ? "Value is too short" : null,
  });

  return (
    <Menu
      styles={{ dropdown: { width: "min-content" } }}
      trigger="click"
      position="bottom"
      withArrow>
      <Menu.Target>
        <ActionIcon
          size={rem(24)}
          p={0}
          variant="transparent"
          styles={{ root: { border: "none" } }}>
          <IconBookmarksFilled />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown p={0}>
        <Paper shadow="md" p="sm">
          <TextInput
            styles={{
              label: { textWrap: "nowrap" },
              input: { minWidth: "min-content" },
            }}
            {...field.getInputProps()}
            label="Bookmark this page"
            placeholder="Enter label"
            size="xs"
            rightSectionWidth="xs"
            rightSection={
              <ActionIcon variant="transparent">
                <IconCheck />
              </ActionIcon>
            }
          />
        </Paper>
      </Menu.Dropdown>
    </Menu>
  );
}

export default PageActionsMenu;
