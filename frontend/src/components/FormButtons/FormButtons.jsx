import { Button, Group } from "@mantine/core";

function FormButtons({
  okLabel = "Save",
  discardLabel = "Cancel",
  okDisabled,
}) {
  return (
    <Group justify="flex-end" mt="sm" gap="xs">
      <Button type="submit" disabled={okDisabled}>
        {okLabel}
      </Button>
      {discardLabel && (
        <Button
          variant="subtle"
          color={discardLabel === "Cancel" ? "blue.6" : "red.6"}>
          {discardLabel}
        </Button>
      )}
    </Group>
  );
}

export default FormButtons;
