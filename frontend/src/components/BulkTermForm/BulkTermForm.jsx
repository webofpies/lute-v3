import { useQuery } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import {
  Checkbox,
  Divider,
  Group,
  Stack,
  TagsInput,
  Text,
} from "@mantine/core";
import StatusRadio from "../StatusRadio/StatusRadio";
import FormButtons from "../FormButtons/FormButtons";
import { tagSuggestionsQuery } from "../../queries/term";

function BulkTermForm({ terms }) {
  const { data: tags } = useQuery(tagSuggestionsQuery);

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
  });

  return (
    <>
      <Text
        fs="italic"
        mb={16}
        component="p"
        size="sm">{`Updating ${terms.length} term(s)`}</Text>
      <form>
        <Stack gap={5}>
          <Checkbox
            label="Convert to lowercase"
            key={form.key("convertToLowerCase")}
            {...form.getInputProps("convertToLowerCase", { type: "checkbox" })}
          />
          <Checkbox
            label="Remove parents"
            key={form.key("removeParents")}
            {...form.getInputProps("removeParents", { type: "checkbox" })}
          />
          <Group>
            <Checkbox
              label="Change status"
              key={form.key("changeStatus")}
              {...form.getInputProps("changeStatus", { type: "checkbox" })}
            />
            <StatusRadio
              form={form}
              disabled={!form.getValues().changeStatus}
            />
          </Group>
          <Divider mt={5} mb={5} />
          <TagsInput
            placeholder="Parent (Limit: one)"
            maxTags={1}
            key={form.key("parent")}
            {...form.getInputProps("parent")}
          />
          <TagsInput
            placeholder="Tags to add"
            data={tags || []}
            key={form.key("tagsAdd")}
            {...form.getInputProps("tagsAdd")}
          />
          <TagsInput
            placeholder="Tags to remove"
            data={tags || []}
            key={form.key("tagsRemove")}
            {...form.getInputProps("tagsRemove")}
          />
        </Stack>

        <FormButtons />
      </form>
    </>
  );
}

export default BulkTermForm;
