import { MRT_ShowHideColumnsButton } from "mantine-react-table";

// just an object instead of factory function results in weird bugs
// e.g actions column appears first, or flashes in the first column briefly
const getDefaultTableOptions = () => ({
  initialState: {
    density: 6,
    showGlobalFilter: true,
    showColumnFilters: true,
  },

  paginationDisplayMode: "pages",
  positionToolbarAlertBanner: "bottom",
  positionActionsColumn: "last",
  enableStickyHeader: true,
  enableDensityToggle: false,
  enableFullScreenToggle: false,
  enableColumnActions: false,

  displayColumnDefOptions: {
    "mrt-row-select": {
      size: 10,
      grow: false,
    },
  },

  mantineTopToolbarProps: {
    style: {
      alignItems: "center",
    },
  },

  mantineCopyButtonProps: {
    display: "block",
  },

  mantineSelectAllCheckboxProps: {
    size: "sm",
  },

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
  },

  mantineTableProps: {
    striped: true,
    withColumnBorders: true,
  },

  mantineFilterTextInputProps: {
    size: "xs",
  },

  mantineFilterSelectProps: {
    size: "xs",
  },

  mantineFilterDateInputProps: {
    size: "xs",
  },

  renderToolbarInternalActions: ({ table }) => (
    <MRT_ShowHideColumnsButton table={table} />
  ),
});

export default getDefaultTableOptions;
