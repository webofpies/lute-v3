import { MRT_Table, useMantineReactTable } from "mantine-react-table";
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
    accessorKey: "url",
    Cell: ({ row }) => (
      <a href={`http://localhost:5001${row.original.url}`}>Download</a>
    ),
  },
];

function BackupsTable({ data }) {
  const table = useMantineReactTable({
    ...tableDefault,
    columns,
    data,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
  });

  return <MRT_Table table={table} />;
}

export default BackupsTable;
