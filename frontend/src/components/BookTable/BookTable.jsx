import { memo } from "react";
import { Link } from "react-router-dom";
import { Center, Loader, Menu, Pill, PillGroup, Text } from "@mantine/core";
import {
  MantineReactTable,
  MRT_ShowHideColumnsButton,
  useMantineReactTable,
} from "mantine-react-table";
import { IconArchive, IconEdit, IconTrash } from "@tabler/icons-react";
import StatsBar from "../StatsBar/StatsBar";

const columns = [
  {
    header: "Title",
    accessorKey: "title",
    minSize: 600,
    columnFilterModeOptions: ["fuzzy", "contains", "startsWith", "endsWith"],
    Cell: ({ row }) => (
      <Link
        to={`/books/${row.original.id}/pages/${row.original.currentPage}`}
        style={{ color: "inherit" }}>
        <Text lineClamp={1}>{row.original.title}</Text>
      </Link>
    ),
  },
  {
    header: "Language",
    accessorKey: "language",
    filterVariant: "select",
    columnFilterModeOptions: false,
  },
  {
    header: "Word Count",
    accessorKey: "wordCount",
    columnFilterModeOptions: ["equals", "notEquals", "greaterThan", "lessThan"],
    filterFn: "greaterThan",
  },
  {
    header: "Status",
    id: "status",
    accessorFn: (row) => (row.status ? row.status[0].percentage : ""),
    Cell: ({ row }) =>
      row.original.status ? (
        <StatsBar data={row.original.status} />
      ) : (
        <Center>
          <Loader type="dots" size="xs" />
        </Center>
      ),
    enableColumnFilter: false,
  },
  {
    header: "Tags",
    id: "tags",
    filterVariant: "multi-select",
    columnFilterModeOptions: false,
    accessorFn: (row) => (row.tags?.length > 0 ? row.tags[0].text : ""),
    Cell: ({ row }) => (
      <PillGroup gap={4}>
        {row.original.tags.map((tag) => (
          <Pill key={tag.text}>{tag.text}</Pill>
        ))}
      </PillGroup>
    ),
  },
];

function BookTable({ data }) {
  const table = useMantineReactTable({
    columns: columns,
    data: data || [],

    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
      density: 4,
      showGlobalFilter: true,
      showColumnFilters: true,
      columnVisibility: {
        tags: false,
      },
    },

    state: { isLoading: data.length === 0 },

    paginationDisplayMode: "pages",
    enableFacetedValues: true,
    enableStickyHeader: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnFilterModes: true,

    mantinePaperProps: {
      withBorder: false,
      shadow: false,
    },
    mantineSearchTextInputProps: {
      w: 200,
      size: "xs",
      leftSectionProps: {
        style: {
          padding: "5px",
        },
      },
    },
    mantineTableContainerProps: {
      mah: 800,
      pl: 30,
      pr: 30,
    },
    mantineTableProps: {
      striped: true,
      withColumnBorders: true,
    },

    renderToolbarInternalActions: ({ table }) => {
      return <MRT_ShowHideColumnsButton table={table} />;
    },
    renderRowActionMenuItems: ({ row }) => [
      <Menu.Item
        leftSection={<IconEdit />}
        key={"edit"}
        onClick={() => {
          console.info("Edit", row);
        }}>
        Edit
      </Menu.Item>,
      <Menu.Item
        leftSection={<IconArchive />}
        key={"archive"}
        onClick={() => {
          console.info("Archive", row);
        }}>
        Archive book
      </Menu.Item>,
      <Menu.Item
        leftSection={<IconTrash />}
        key={"delete"}
        onClick={() => {
          console.info("Delete", row);
        }}>
        Delete book
      </Menu.Item>,
    ],
  });

  return <MantineReactTable table={table} />;
}

export default memo(BookTable);
