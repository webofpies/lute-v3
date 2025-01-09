import { Checkbox } from "@mantine/core";
import ActionsMenu from "./ActionsMenu";

function TopToolbarActions({
  data,
  table,
  showParentsOnly,
  onSetEditModalOpened,
  onSetShowParentsOnly,
}) {
  return (
    <>
      <ActionsMenu
        table={table}
        data={data}
        onSetEditOpened={onSetEditModalOpened}
      />
      <Checkbox
        checked={showParentsOnly}
        onChange={(e) => onSetShowParentsOnly(e.currentTarget.checked)}
        label="Parent terms only"
        size="sm"
        ml="auto"
        mr="xs"
        style={{ alignSelf: "center" }}
      />
    </>
  );
}

export default TopToolbarActions;
