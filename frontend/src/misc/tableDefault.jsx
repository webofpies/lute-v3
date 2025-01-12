import { MRT_ShowHideColumnsButton } from "mantine-react-table";

const tableDefault = {
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

  renderToolbarInternalActions: ({ table }) => (
    <MRT_ShowHideColumnsButton table={table} />
  ),
};

export default tableDefault;
