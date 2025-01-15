import {
  Box,
  Checkbox,
  Divider,
  Group,
  Stack,
  TagsInput,
  Text,
} from "@mantine/core";
import StatusRadio from "../TermForm/StatusRadio";
import FormButtons from "../FormButtons/FormButtons";
import { useForm } from "@mantine/form";

function BulkTermForm({ termIds }) {
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
    <Box p={20}>
      <Text
        fs="italic"
        mb={16}
        component="p"
        size="sm">{`Updating ${termIds.length} term(s)`}</Text>
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

        <FormButtons />
      </form>
    </Box>
  );
}

export default BulkTermForm;
