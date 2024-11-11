import { Fragment, useState } from "react";
import {
  ActionIcon,
  Button,
  CloseButton,
  Group,
  List,
  Menu,
  rem,
  ScrollArea,
  SegmentedControl,
  Stack,
  TextInput,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { IconBookmarkPlus, IconSearch } from "@tabler/icons-react";

const bookmarks = ["temp", "temp", "temp", "temp", "temp"];

function BookmarksMenu() {
  const [bookmarkMenuSegment, setBookmarkMenuSegment] = useState("add");

  const field = useField({
    initialValue: "",
    validate: (value) =>
      value.trim().length < 2 ? "Value is too short" : null,
  });

  return (
    <Menu
      trigger="click"
      openDelay={50}
      closeDelay={50}
      position="bottom-end"
      withArrow>
      <Menu.Target>
        <ActionIcon
          size={rem(24)}
          p={0}
          variant="transparent"
          styles={{ root: { border: "none" } }}>
          <IconBookmarkPlus stroke={2.3} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown p="sm">
        <SegmentedControl
          value={bookmarkMenuSegment}
          fullWidth
          size="xs"
          withItemsBorders={false}
          color="blue"
          data={[
            { value: "add", label: "Add" },
            { value: "list", label: "List" },
          ]}
          onChange={(v) => setBookmarkMenuSegment(v)}
        />
        <div style={{ width: "200px" }}>
          {bookmarkMenuSegment === "add" ? (
            <Fragment>
              <TextInput
                {...field.getInputProps()}
                label="Label"
                placeholder="Enter bookmark label"
                size="xs"
                mt="0.1rem"
              />
              <Button size="xs" mt="xs" fullWidth onClick={field.validate}>
                Save
              </Button>
            </Fragment>
          ) : (
            <>
              <TextInput
                mt="0.5rem"
                placeholder="Search bookmarks"
                size="xs"
                leftSection={<IconSearch size={rem(16)} />}
              />
              <ScrollArea h="130px" mt="0.5rem">
                <List listStyleType="none">
                  <Stack gap="0.2rem" pr="sm" pl="sm">
                    {bookmarks.map((b) => (
                      <List.Item key={b}>
                        <TextInput
                          value={b}
                          placeholder="Enter bookmark label"
                          size="xs"
                          rightSection={
                            <CloseButton aria-label="Clear input" />
                          }
                        />
                      </List.Item>
                    ))}
                  </Stack>
                </List>
              </ScrollArea>
              <Group gap="0.2rem" mt="xs" grow>
                <Button size="xs" onClick={field.validate}>
                  Cancel
                </Button>
                <Button size="xs" onClick={field.validate}>
                  Save
                </Button>
              </Group>
            </>
          )}
        </div>
      </Menu.Dropdown>
    </Menu>
  );
}

export default BookmarksMenu;
