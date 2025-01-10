import { memo, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Box,
  FileInput,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  Pill,
  PillGroup,
  SegmentedControl,
  Stack,
  TagsInput,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  MantineReactTable,
  MRT_EditActionButtons,
  MRT_ShowHideColumnsButton,
  useMantineReactTable,
} from "mantine-react-table";
import {
  IconArchive,
  IconArchiveFilled,
  IconCircleCheckFilled,
  IconHeading,
  IconHeadphones,
  IconLink,
  IconTags,
  IconTrash,
} from "@tabler/icons-react";
import StatsBar from "../StatsBar/StatsBar";
import { languageInfoQuery } from "../../queries/language";

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
const fetchURL = new URL("/api/books", "http://localhost:5001");

function BooksTable({ languageChoices, tagChoices }) {
  const columns = useMemo(
    () => getColumns(languageChoices, tagChoices),
    [languageChoices, tagChoices]
  );

  const [shelf, setShelf] = useState("active");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState(PAGINATION);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnFilterFns, setColumnFilterFns] = useState(COLUMN_FILTER_FNS);

  fetchURL.searchParams.set("shelf", shelf);
  fetchURL.searchParams.set(
    "start",
    `${pagination.pageIndex * pagination.pageSize}`
  );
  fetchURL.searchParams.set("size", `${pagination.pageSize}`);
  fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
  fetchURL.searchParams.set(
    "filterModes",
    JSON.stringify(columnFilterFns ?? {})
  );
  fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
  fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

  const { data } = useQuery({
    queryKey: ["allBooks", fetchURL.href],
    queryFn: async () => {
      const response = await fetch(fetchURL.href);
      return await response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const table = useMantineReactTable({
    columns: columns,
    data: data?.data || [],
    rowCount: data?.total,

    initialState: {
      density: 4,
      showGlobalFilter: true,
      showColumnFilters: true,
      columnVisibility: {
        tags: false,
      },
    },

    state: {
      columnFilterFns,
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },

    paginationDisplayMode: "pages",
    positionActionsColumn: "last",
    enableStickyHeader: true,
    enableRowActions: true,
    enableColumnFilterModes: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableEditing: true,
    editDisplayMode: "modal",
    renderEditRowModalContent: ({ row, table }) => (
      <EditModal row={row} table={table} />
    ),

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

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
    renderRowActionMenuItems: ({ row }) => actionItems(row),
    renderBottomToolbarCustomActions: () => (
      <ShelfSwitch shelf={shelf} onSetShelf={setShelf} />
    ),
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

function EditModal({ row, table }) {
  const { data: language, isFetching } = useQuery(
    languageInfoQuery(row.original.languageId)
  );
  return (
    <Box pos="relative">
      <LoadingOverlay visible={isFetching} />
      {language && (
        <Stack>
          <Title order={5}>Edit Book</Title>
          <TextInput
            wrapperProps={{ dir: language.isRightToLeft ? "rtl" : "ltr" }}
            required
            withAsterisk
            label="Title"
            leftSection={<IconHeading />}
            defaultValue={row.original.title}
          />
          <FileInput
            label="Audio file"
            description=".mp3, .m4a, .wav, .ogg, .opus"
            accept="audio/mpeg,audio/ogg, audio/mp4"
            leftSection={<IconHeadphones />}
            clearable
          />
          <TextInput
            label="Source URL"
            leftSection={<IconLink />}
            defaultValue={row.original.source}
          />
          <TagsInput
            label="Tags"
            leftSection={<IconTags />}
            defaultValue={row.original.tags}
          />
          <Flex justify="flex-end">
            <MRT_EditActionButtons row={row} table={table} variant="text" />
          </Flex>
        </Stack>
      )}
    </Box>
  );
}

function ShelfSwitch({ shelf, onSetShelf }) {
  return (
    <Box pl={5}>
      <SegmentedControl
        size="sm"
        value={shelf}
        onChange={onSetShelf}
        data={[
          { label: "Active", value: "active" },
          { label: "All", value: "all" },
          { label: "Archived", value: "archived" },
        ]}
      />
    </Box>
  );
}

function actionItems(row) {
  return [
    <Menu.Item
      leftSection={<IconArchive />}
      key={"archive"}
      onClick={() => {
        console.info("Archive", row);
      }}>
      Archive
    </Menu.Item>,
    <Menu.Item
      leftSection={<IconTrash />}
      key={"delete"}
      onClick={() => {
        console.info("Delete", row);
      }}>
      Delete
    </Menu.Item>,
  ];
}

function getColumns(languageChoices, tagChoices) {
  return [
    {
      header: "Title",
      accessorKey: "title",
      minSize: 600,
      columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
      Cell: ({ row }) => {
        const currentPage = row.original.currentPage;
        const pageCount = row.original.pageCount;
        const title = row.original.title;
        const isCompleted = row.original.isCompleted;
        const isArchived = row.original.isArchived;
        return (
          <Group gap={5} align="center">
            <ThemeIcon
              size="sm"
              color={isCompleted ? "green.6" : "dark.1"}
              variant="transparent">
              <IconCircleCheckFilled />
            </ThemeIcon>
            <Link
              to={`/books/${row.original.id}/pages/${currentPage}`}
              style={{ color: "inherit", textDecoration: "none" }}>
              <Text lineClamp={1}>{title}</Text>
            </Link>
            {currentPage > 1 && (
              <Text component="span" size="sm" c="dimmed">
                ({currentPage}/{pageCount})
              </Text>
            )}
            {isArchived && (
              <ThemeIcon
                size="xs"
                variant="transparent"
                color="dimmed"
                opacity="0.4">
                <IconArchiveFilled />
              </ThemeIcon>
            )}
          </Group>
        );
      },
    },
    {
      header: "Language",
      accessorKey: "language",
      filterVariant: "select",
      columnFilterModeOptions: false,
      mantineFilterSelectProps: {
        data: languageChoices,
      },
    },
    {
      header: "Word Count",
      accessorKey: "wordCount",
      columnFilterModeOptions: [
        "equals",
        "greaterThan",
        "lessThan",
        "notEquals",
      ],
    },
    {
      header: "Status",
      id: "status",
      accessorFn: (row) => row.unknownPercent,
      Cell: ({ row }) => <StatsBar id={row.original.id} />,
      columnFilterModeOptions: [
        "equals",
        "greaterThan",
        "lessThan",
        "notEquals",
      ],
      mantineFilterTextInputProps: {
        placeholder: "Filter by Unknown %",
      },
    },
    {
      header: "Tags",
      id: "tags",
      mantineFilterSelectProps: {
        data: tagChoices,
      },
      filterVariant: "select",
      columnFilterModeOptions: false,
      accessorFn: (row) => (row.tags.length > 0 ? row.tags.join() : ""),
      Cell: ({ row }) => (
        <PillGroup gap={4}>
          {row.original.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </PillGroup>
      ),
    },
  ];
}

export default memo(BooksTable);
