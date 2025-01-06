import { memo, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Center, Group, Pill, PillGroup, Text, ThemeIcon } from "@mantine/core";
import {
  MantineReactTable,
  MRT_EditActionButtons,
  MRT_ShowHideColumnsButton,
  useMantineReactTable,
} from "mantine-react-table";
import { Cell } from "recharts";

const PAGINATION = {
  pageIndex: 0,
  pageSize: 10,
};

const COLUMN_FILTER_FNS = {
  title: "contains",
  language: "contains",
  wordCount: "greaterThan",
  status: "greaterThan",
};

//build the URL (start=0&size=10&filters=[]&globalFilter=&sorting=[])
const fetchURL = new URL("/api/terms", "http://localhost:5001");

function TermsTable({ languageChoices, tagChoices }) {
  const columns = useMemo(
    () => getColumns(languageChoices, tagChoices),
    [languageChoices, tagChoices]
  );

  // const [shelf, setShelf] = useState("active");
  // const [sorting, setSorting] = useState([]);
  // const [pagination, setPagination] = useState(PAGINATION);
  // const [globalFilter, setGlobalFilter] = useState("");
  // const [columnFilters, setColumnFilters] = useState([]);
  // const [columnFilterFns, setColumnFilterFns] = useState(COLUMN_FILTER_FNS);

  // fetchURL.searchParams.set("shelf", shelf);
  // fetchURL.searchParams.set(
  //   "start",
  //   `${pagination.pageIndex * pagination.pageSize}`
  // );
  // fetchURL.searchParams.set("size", `${pagination.pageSize}`);
  // fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
  // fetchURL.searchParams.set(
  //   "filterModes",
  //   JSON.stringify(columnFilterFns ?? {})
  // );
  // fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
  // fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

  // console.log(fetchURL.href);

  const { data } = useQuery({
    queryKey: ["allTerms"],
    queryFn: async () => {
      const response = await fetch(fetchURL.href);
      return await response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const table = useMantineReactTable({
    columns: columns,
    data: data || [],
    // rowCount: data?.total,

    initialState: {
      density: 4,
      showGlobalFilter: true,
      showColumnFilters: true,
      columnVisibility: {
        tags: false,
      },
    },

    // state: {
    //   columnFilterFns,
    //   columnFilters,
    //   globalFilter,
    //   pagination,
    //   sorting,
    // },

    paginationDisplayMode: "pages",
    // positionActionsColumn: "last",
    enableClickToCopy: true,
    enableStickyHeader: true,
    enableRowSelection: true,
    // enableRowActions: true,
    enableColumnFilterModes: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    // enableEditing: true,
    // editDisplayMode: "modal",
    // renderEditRowModalContent: ({ row, table }) => console.log(),

    // manualFiltering: true,
    // manualPagination: true,
    // manualSorting: true,
    // onColumnFilterFnsChange: setColumnFilterFns,
    // onColumnFiltersChange: setColumnFilters,
    // onGlobalFilterChange: setGlobalFilter,
    // onPaginationChange: setPagination,
    // onSortingChange: setSorting,

    mantineSelectCheckboxProps: {
      size: "sm",
    },
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
      mah: 600,
      pl: 30,
      pr: 30,
    },
    mantineTableProps: {
      striped: true,
      withColumnBorders: true,
    },

    renderToolbarInternalActions: ({ table }) => (
      <MRT_ShowHideColumnsButton table={table} />
    ),
    renderEmptyRowsFallback: ({ table }) => <EmptyFallback table={table} />,
    // renderRowActionMenuItems: ({ row }) => actionItems(row),
    // renderBottomToolbarCustomActions: () => (
    //   <ShelfSwitch shelf={shelf} onSetShelf={setShelf} />
    // ),
  });

  return data && <MantineReactTable table={table} />;
}

function EmptyFallback({ table }) {
  const language = table.getColumn("language").getFilterValue();
  const isLanguageFiltered = language?.length > 0;

  return isLanguageFiltered ? (
    <div style={{ textAlign: "center", padding: "20px" }}>
      No books found for <strong>{language}</strong>.{" "}
      <Link
        to={`/books/new?name=${encodeURIComponent(language.replace(/\s/g, "%20"))}`}>
        Create one?
      </Link>
    </div>
  ) : null;
}

// function ShelfSwitch({ shelf, onSetShelf }) {
//   return (
//     <Box pl={5}>
//       <SegmentedControl
//         size="sm"
//         value={shelf}
//         onChange={onSetShelf}
//         data={[
//           { label: "Active", value: "active" },
//           { label: "All", value: "all" },
//           { label: "Archived", value: "archived" },
//         ]}
//       />
//     </Box>
//   );
// }

// function actionItems(row) {
//   return [
//     <Menu.Item
//       leftSection={<IconArchive />}
//       key={"archive"}
//       onClick={() => {
//         console.info("Archive", row);
//       }}>
//       Archive
//     </Menu.Item>,
//     <Menu.Item
//       leftSection={<IconTrash />}
//       key={"delete"}
//       onClick={() => {
//         console.info("Delete", row);
//       }}>
//       Delete
//     </Menu.Item>,
//   ];
// }

function getColumns(languageChoices, tagChoices) {
  return [
    {
      header: "Term",
      accessorKey: "text",
      minSize: 600,
      columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
      Cell: ({ row }) => (
        <Group gap="xs">
          <ThemeIcon
            size="xs"
            radius="xl"
            p="xs"
            color={`var(--lute-color-highlight-status${row.original.statusId}`}>
            <Text fw="normal" size="xs" component="span" c="dark.6">
              {row.original.statusId}
            </Text>
          </ThemeIcon>
          <Text>{row.original.text}</Text>
        </Group>
      ),
    },
    {
      header: "Parent",
      accessorKey: "parentText",
      columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    },
    {
      header: "Translation",
      accessorKey: "translation",
      columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    },
    {
      header: "Language",
      accessorKey: "language",
      filterVariant: "select",
      columnFilterModeOptions: false,
      mantineFilterSelectProps: {
        data: languageChoices,
      },
      enableClickToCopy: false,
    },
    {
      header: "Added On",
      accessorKey: "createdOn",
      columnFilterModeOptions: false,
      enableClickToCopy: false,
    },
    // {
    //   header: "Status",
    //   id: "status",
    //   accessorFn: (row) => row.statusLabel,
    //   columnFilterModeOptions: [
    //     "equals",
    //     "greaterThan",
    //     "lessThan",
    //     "notEquals",
    //   ],
    //   mantineFilterTextInputProps: {
    //     placeholder: "Filter by Unknown %",
    //   },
    // },
    // {
    //   header: "Tags",
    //   id: "tags",
    //   mantineFilterSelectProps: {
    //     data: tagChoices,
    //   },
    //   filterVariant: "select",
    //   columnFilterModeOptions: false,
    //   accessorFn: (row) => (row.tags.length > 0 ? row.tags.join() : ""),
    //   Cell: ({ row }) => (
    //     <PillGroup gap={4}>
    //       {row.original.tags.map((tag) => (
    //         <Pill key={tag}>{tag}</Pill>
    //       ))}
    //     </PillGroup>
    //   ),
    // },
  ];
}

export default memo(TermsTable);
