import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import tableDefault from "../../misc/tableDefault";

const columns = [
  {
    accessorKey: "name",
    header: "File name",
  },
  {
    accessorKey: "size",
    header: "File size",
  },
  {
    accessorKey: "lastModified",
    header: "Last modified",
  },
  {
    id: "download",
    header: "Download",
    columnDefType: "display",
    minSize: 10,
    size: 10,
    Cell: ({ row }) => (
      <Tooltip label="Download">
        <ActionIcon
          variant="subtle"
          component="a"
          href={`http://localhost:5001/backup/download/${row.original.name}`}>
          <IconDownload />
        </ActionIcon>
      </Tooltip>
    ),
  },
];

function BackupsTable({ data }) {
  const table = useMantineReactTable({
    ...tableDefault,
    columns,
    data,

    mantineTableContainerProps: {
      mah: 500,
    },
    mantineTableProps: {
      ...tableDefault.mantineTableProps,
      highlightOnHover: false,
    },

    enableToolbarInternalActions: false,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
  });

  return <MantineReactTable table={table} />;
}

export default BackupsTable;
