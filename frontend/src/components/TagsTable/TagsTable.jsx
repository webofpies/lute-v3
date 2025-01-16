import { useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import getDefaultTableOptions from "../../misc/getDefaultTableOptions";

const defaultOptions = getDefaultTableOptions();

const columns = [
  {
    accessorKey: "text",
    header: "Tag",
  },
  {
    accessorKey: "comment",
    header: "Comment",
  },
  {
    accessorKey: "termCount",
    header: "Term Count",
    columnFilterModeOptions: false,
    enableEditing: false,
  },
];

function TagsTable({ data }) {
  const [openCreateTagModal, setOpenCreateTagModal] = useState(false);

  const table = useMantineReactTable({
    ...defaultOptions,

    columns: columns,
    data: data,

    initialState: {
      ...defaultOptions.initialState,

      columnFilterFns: {
        text: "contains",
        termCount: "equals",
        comment: "contains",
      },
    },

    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    enableRowActions: true,
    enableColumnFilterModes: true,
    enableEditing: true,
    editDisplayMode: "row",
    renderRowActions: ({ row, table }) => (
      <>
        <ActionIcon
          variant="transparent"
          onClick={() => {
            table.setEditingRow(row);
          }}>
          <IconEdit />
        </ActionIcon>
        <ActionIcon variant="transparent" color="red.6">
          <IconTrash />
        </ActionIcon>
      </>
    ),
    renderTopToolbarCustomActions: () => (
      <Button onClick={() => setOpenCreateTagModal(true)}>Create new</Button>
    ),
  });

  return (
    <>
      <MantineReactTable table={table} />
      <Modal
        trapFocus
        opened={openCreateTagModal}
        onClose={() => setOpenCreateTagModal(false)}
        title="Create new term tag"
        withCloseButton>
        <TextInput label="Name" placeholder="Tag" withAsterisk />
        <Textarea
          label="Comment"
          placeholder="Comment"
          resize="vertical"
          autosize
          spellCheck={false}
          autoCapitalize="off"
          minRows={3}
        />
        <Group justify="flex-end" mt="sm" gap={5} wrap="nowrap">
          <Button>Save</Button>
        </Group>
      </Modal>
    </>
  );
}

export default TagsTable;
