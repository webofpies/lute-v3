import {
  Button,
  Checkbox,
  Divider,
  Group,
  Stack,
  TagsInput,
} from "@mantine/core";
import StatusRadio from "../TermForm/StatusRadio";
import { useForm } from "@mantine/form";

function TermsBulkEditForm() {
  const form = useForm({
    initialValues: {
      convertToLowerCase: false,
      removeParents: false,
      changeStatus: false,
      status: false,
      parent: [],
      tagsAdd: [],
      tagsRemove: [],
    },
    enhanceGetInputProps: ({ form, field }) => {
      if (field === "status") {
        const changeStatus = form.getValues().changeStatus;

        if (!changeStatus)
          return {
            disabled: true,
          };

        return { disabled: false };
      }
    },
  });
  return (
    <form>
      <Stack gap={5}>
        <Checkbox label="Convert to lowercase" />
        <Checkbox label="Remove parents" />
        <Group>
          <Checkbox label="Change status" />
          <StatusRadio form={form} />
        </Group>
        <Divider mt={5} mb={5} />
        <TagsInput placeholder="Parent (Limit: one)" maxTags={1} />
        <TagsInput placeholder="Tags to add" />
        <TagsInput placeholder="Tags to remove" />
      </Stack>
      <Group justify="flex-end" mt="sm" gap="xs" wrap="nowrap">
        <Button type="submit">Save</Button>
        <Button variant="subtle">Cancel</Button>
      </Group>
    </form>
  );
}

export default TermsBulkEditForm;
