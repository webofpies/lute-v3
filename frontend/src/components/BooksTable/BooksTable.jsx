import { memo, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Box,
  FileInput,
  Flex,
  LoadingOverlay,
  Menu,
  SegmentedControl,
  Stack,
  TagsInput,
  TextInput,
  Title,
} from "@mantine/core";
import {
  MantineReactTable,
  MRT_EditActionButtons,
  useMantineReactTable,
} from "mantine-react-table";
import {
  IconArchive,
  IconHeading,
  IconHeadphones,
  IconLink,
  IconTags,
  IconTrash,
} from "@tabler/icons-react";
import EmptyRow from "../EmptyRow/EmptyRow";
import tableDefault from "../../misc/tableDefault";
import { definedLangInfoQuery } from "../../queries/language";
import columnDefinition from "./columnDefinition";

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
    () => columnDefinition(languageChoices, tagChoices),
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
    ...tableDefault,

    columns: columns,
    data: data?.data || [],
    rowCount: data?.total,

    initialState: {
      ...tableDefault.initialState,
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

    enableRowActions: true,
    enableColumnFilterModes: true,
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

    renderEmptyRowsFallback: ({ table }) => {
      const language = table.getColumn("language").getFilterValue();
      const isLanguageFiltered = language?.length > 0;
      return isLanguageFiltered ? (
        <EmptyRow
          tableName="books"
          language={language}
          languageChoices={languageChoices}
        />
      ) : null;
    },
    renderRowActionMenuItems: ({ row }) => actionItems(row),
    renderBottomToolbarCustomActions: () => (
      <ShelfSwitch shelf={shelf} onSetShelf={setShelf} />
    ),
  });

  return data && <MantineReactTable table={table} />;
}

function EditModal({ row, table }) {
  const { data: language, isFetching } = useQuery(
    definedLangInfoQuery(row.original.languageId)
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

export default memo(BooksTable);
