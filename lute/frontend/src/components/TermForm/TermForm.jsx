import {
  useForm,
  // isNotEmpty, isEmail, isInRange, hasLength, matches
} from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  Textarea,
  TagsInput,
  Radio,
  Image,
  Grid,
  Stack,
  CheckIcon,
  Checkbox,
} from "@mantine/core";
import { memo, useEffect } from "react";

function TermForm({ termData }) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      text: "",
      translation: "",
      parents: [],
      status: "",
      syncStatus: "",
      tags: [],
    },

    // validate: {
    //   name: hasLength({ min: 2, max: 10 }, "Name must be 2-10 characters long"),
    //   job: isNotEmpty("Enter your current job"),
    //   email: isEmail("Invalid email"),
    //   favoriteColor: matches(/^#([0-9a-f]{3}){1,2}$/, "Enter a valid hex color"),
    //   age: isInRange({ min: 18, max: 99 }, "You must be 18-99 years old to register"),
    // },
  });

  useEffect(() => {
    form.setValues({
      ...termData,
      status: String(termData.status),
      syncStatus: String(termData.syncStatus),
    });
  }, [termData.text]);

  return (
    <form>
      <Stack justify="center" gap={5} pt="1.4rem" pb="1.4rem" pr="1.4rem">
        <TextInput
          placeholder="Term"
          withAsterisk
          key={form.key("text")}
          {...form.getInputProps("text")}
        />
        <TagsInput
          placeholder="Parents"
          key={form.key("parents")}
          {...form.getInputProps("parents")}
        />
        <Grid align="flex-start" justify="center" gutter={"0.5rem"}>
          <Grid.Col span={11}>
            <Textarea
              resize="vertical"
              placeholder="Translation"
              key={form.key("translation")}
              {...form.getInputProps("translation")}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <Image
              w="100%"
              // h="100%"
              styles={{
                root: { aspectRatio: 1 },
              }}
              // src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
            />
          </Grid.Col>
        </Grid>
        <Group gap="1.5rem">
          <Radio.Group
            defaultValue="1"
            name="status"
            key={form.key("status")}
            {...form.getInputProps("status")}>
            <Group justify="flex-start" gap="0.2rem">
              <Radio icon={CheckIcon} name="1" value="1" />
              <Radio icon={CheckIcon} name="2" value="2" />
              <Radio icon={CheckIcon} name="3" value="3" />
              <Radio icon={CheckIcon} name="4" value="4" />
              <Radio icon={CheckIcon} name="5" value="5" />
              <Radio icon={CheckIcon} name="98" value="98" />
              <Radio icon={CheckIcon} name="99" value="99" />
            </Group>
          </Radio.Group>
          <Checkbox
            label="Link to parent"
            key={form.key("syncStatus")}
            {...form.getInputProps("syncStatus", { type: "checkbox" })}
          />
        </Group>
        <TagsInput
          placeholder="Tags"
          key={form.key("tags")}
          {...form.getInputProps("tags")}
        />
        <Group justify="flex-end" mt="sm" gap="xs">
          <Button>Delete</Button>
          <Button type="submit">Save</Button>
        </Group>
      </Stack>
    </form>
  );
}

export default memo(TermForm);
