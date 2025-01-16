import { memo, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Modal } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import BulkTermForm from "../BulkTermForm/BulkTermForm";
import EmptyRow from "../EmptyRow/EmptyRow";
import Actions from "./Actions";
import getDefaultTableOptions from "../../misc/getDefaultTableOptions";
import columnDefinition from "./columnDefinition";

const defaultOptions = getDefaultTableOptions();

const PAGINATION = {
  pageIndex: 0,
  pageSize: 10,
};

const COLUMN_FILTER_FNS = {
  text: "contains",
  parentText: "contains",
  translation: "contains",
  language: "contains",
};

const COLUMN_FILTERS = [{ id: "status", value: [0, 6] }];

//build the URL (start=0&size=10&filters=[]&globalFilter=&sorting=[])
const url = new URL("/api/terms", "http://localhost:5001");

function TermsTable({ languageChoices, tagChoices }) {
  const columns = useMemo(
    () => columnDefinition(languageChoices, tagChoices),
    [languageChoices, tagChoices]
  );

  const [editModalOpened, setEditModalOpened] = useState(false);

  const [showParentsOnly, setShowParentsOnly] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState(PAGINATION);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState(COLUMN_FILTERS);
  const [columnFilterFns, setColumnFilterFns] = useState(COLUMN_FILTER_FNS);

  const [columnVisibility, setColumnVisibility] = useState({
    tags: false,
    createdOn: false,
    parentText: true,
  });

  function handleShowParentsOnly(e) {
    setColumnVisibility((v) => ({ ...v, parentText: !v.parentText }));
    setShowParentsOnly(e.currentTarget.checked);
  }

  url.searchParams.set("parentsOnly", showParentsOnly);
  url.searchParams.set(
    "start",
    `${pagination.pageIndex * pagination.pageSize}`
  );
  url.searchParams.set("size", `${pagination.pageSize}`);
  url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
  url.searchParams.set("filterModes", JSON.stringify(columnFilterFns ?? {}));
  url.searchParams.set("globalFilter", globalFilter ?? "");
  url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

  const response = useQuery({
    queryKey: ["allTerms", url.href],
    queryFn: async () => {
      const response = await fetch(url.href);
      return await response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const data = response.data;
  const table = useMantineReactTable({
    ...defaultOptions,

    columns: columns,
    data: data?.data || [],
    rowCount: data?.total,
    localization: {
      min: "From",
      max: "To",
    },

    initialState: {
      ...defaultOptions.initialState,
    },

    state: {
      columnFilterFns,
      columnFilters,
      globalFilter,
      pagination,
      sorting,
      columnVisibility,
    },

    enableClickToCopy: true,
    enableRowSelection: true,
    enableColumnFilterModes: true,

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,

    getRowId: (originalRow) => originalRow.id,

    renderEmptyRowsFallback: ({ table }) => {
      const language = table.getColumn("language").getFilterValue();
      const isLanguageFiltered = language?.length > 0;
      return isLanguageFiltered ? (
        <EmptyRow
          tableName="terms"
          language={language}
          languageChoices={languageChoices}
        />
      ) : null;
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Actions
        table={table}
        onSetEditModalOpened={setEditModalOpened}
        showParentsOnly={showParentsOnly}
        onShowParentsOnly={handleShowParentsOnly}
      />
    ),
  });

  return (
    <>
      <MantineReactTable table={table} />
      <Modal
        trapFocus
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="Edit term(s)"
        withCloseButton>
        <BulkTermForm termIds={Object.keys(table.getState().rowSelection)} />
      </Modal>
    </>
  );
}

export default memo(TermsTable);
