import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
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
];

function BackupsTable({ data }) {
  const table = useMantineReactTable({
    ...tableDefault,
    columns,
    data,

    mantineTableContainerProps: {
      mah: 500,
    },

    enableToolbarInternalActions: false,
    enableGlobalFilter: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <a href={`http://localhost:5001/backup/download/${row.original.name}`}>
        Download
      </a>
    ),
  });

  return <MantineReactTable table={table} />;
}

export default BackupsTable;
