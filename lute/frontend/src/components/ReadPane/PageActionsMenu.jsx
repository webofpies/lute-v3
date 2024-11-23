import {
  ActionIcon,
  Button,
  Divider,
  Menu,
  Paper,
  rem,
  Text,
  TextInput,
} from "@mantine/core";
import { useField } from "@mantine/form";
import {
  IconBook,
  IconCheck,
  IconFileArrowLeft,
  IconFileArrowRight,
  IconFilePencil,
  IconFileX,
} from "@tabler/icons-react";
import { actions } from "../../misc/actionsMap";

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
          <IconBook />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown p={0}>
        <Paper shadow="md" p="sm">
          <Text size="xs" fw={500} mb={rem(2)}>
            Page actions
          </Text>
          {getButtons().map((button) => {
            const Icon = button.icon;
            return (
              <Menu.Item key={button.label} p={0} w="auto" component="div">
                <Button
                  fw="normal"
                  variant="transparent"
                  justify="flex-start"
                  size="xs"
                  leftSection={<Icon size={20} />}
                  onClick={() => actions[button.action]()}>
                  {button.label}
                </Button>
              </Menu.Item>
            );
          })}

          <Divider mt="xs" />

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

function getButtons() {
  return [
    {
      label: "Edit current page",
      icon: IconFilePencil,
      action: "editPage",
      arg: "",
    },
    {
      label: "Add page after",
      icon: IconFileArrowRight,
      action: "addPageAfter",
      arg: "",
    },
    {
      label: "Add page before",
      icon: IconFileArrowLeft,
      action: "addPageBefore",
      arg: "",
    },
    {
      label: "Delete current page",
      icon: IconFileX,
      action: "deletePage",
      arg: "",
    },
  ];
}

export default PageActionsMenu;
