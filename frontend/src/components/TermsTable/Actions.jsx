import { Checkbox } from "@mantine/core";
import { Button, FileButton, Menu, rem } from "@mantine/core";
import {
  IconDownload,
  IconEdit,
  IconFileText,
  IconListCheck,
  IconTrashFilled,
  IconUpload,
} from "@tabler/icons-react";

function Actions({
  table,
  onSetEditModalOpened,
  showParentsOnly,
  onShowParentsOnly,
}) {
  const iconSize = { width: rem(16), height: rem(16) };
  return (
    <>
      <Menu shadow="md" width={200} position="right-start" withArrow>
        <Menu.Target>
          <Button>Actions</Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Edit</Menu.Label>
          <Menu.Item
            onClick={() => onSetEditModalOpened(true)}
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            leftSection={<IconEdit style={iconSize} />}>
            Edit selected
          </Menu.Item>
          <Menu.Item
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            leftSection={<IconTrashFilled style={iconSize} />}>
            Delete selected
          </Menu.Item>
          <Menu.Label>Export</Menu.Label>
          {/* //export all data that is currently in the table (ignore pagination, */}
          {/* sorting, filtering, etc.) */}
          <Menu.Item
            component="a"
            href="http://localhost:5001/api/terms/export"
            leftSection={<IconDownload style={iconSize} />}>
            All
          </Menu.Item>
          {/* //export all rows as seen on the screen (respects pagination, sorting, */}
          {/* filtering, etc.) */}
          <Menu.Item
            disabled={table.getRowModel().rows.length === 0}
            // onClick={() => handleExportRows(table.getRowModel().rows)}
            leftSection={<IconFileText style={iconSize} />}>
            Page
          </Menu.Item>
          <Menu.Item
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            // onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            leftSection={<IconListCheck style={iconSize} />}>
            Selected
          </Menu.Item>
          <Menu.Label>Import</Menu.Label>
          <FileButton accept="text/csv">
            {(props) => (
              <Menu.Item
                {...props}
                leftSection={<IconUpload style={iconSize} />}>
                Import terms (CSV)
              </Menu.Item>
            )}
          </FileButton>
        </Menu.Dropdown>
      </Menu>

      <Checkbox
        checked={showParentsOnly}
        onChange={onShowParentsOnly}
        label="Parent terms only"
        size="sm"
        ml="auto"
        mr="xs"
        style={{ alignSelf: "center" }}
      />
      {/* <Chip
        checked={showParentsOnly}
        onChange={onShowParentsOnly}
        style={{ alignSelf: "center" }}
        size="sm"
        ml="auto"
        mr="xs">
        Parent terms only
      </Chip> */}
    </>
  );
}

export default Actions;
