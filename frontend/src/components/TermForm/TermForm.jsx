import { memo } from "react";
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
  CheckIcon,
  Checkbox,
  rem,
} from "@mantine/core";
import TermImage from "./TermImage";
import classes from "./TermForm.module.css";

function TermForm({ termData, translationFieldRef, dir, showPronunciation }) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      ...termData,
      status: String(termData.status),
      syncStatus: String(termData.syncStatus),
    },

    // validate: {
    //   name: hasLength({ min: 2, max: 10 }, "Name must be 2-10 characters long"),
    //   job: isNotEmpty("Enter your current job"),
    //   email: isEmail("Invalid email"),
    //   favoriteColor: matches(/^#([0-9a-f]{3}){1,2}$/, "Enter a valid hex color"),
    //   age: isInRange({ min: 18, max: 99 }, "You must be 18-99 years old to register"),
    // },
  });

  return (
    <form>
      <div className={classes.container}>
        <TextInput
          wrapperProps={{ dir: dir }}
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
        {showPronunciation && (
          <TextInput
            placeholder="Pronunciation"
            key={form.key("romanization")}
            {...form.getInputProps("romanization")}
          />
        )}
        <div className={classes.flex}>
          <Textarea
            onFocusCapture={(e) => {
              const input = e.target;
              input.setSelectionRange(input.value.length, input.value.length);
            }}
            autosize
            spellCheck={false}
            autoCapitalize="off"
            flex={1}
            wrapperProps={{ dir: dir }}
            ref={translationFieldRef}
            autoFocus
            resize="vertical"
            placeholder="Translation"
            key={form.key("translation")}
            {...form.getInputProps("translation")}
          />
          {termData.currentImg && (
            <TermImage src={`http://localhost:5001${termData.currentImg}`} />
          )}
        </div>
        <Group gap="md" style={{ rowGap: rem(5) }}>
          <Radio.Group
            name="status"
            key={form.key("status")}
            {...form.getInputProps("status")}>
            <Group justify="flex-start" gap={3}>
              <Radio
                color="status.0"
                iconColor="dark.4"
                icon={CheckIcon}
                name="1"
                value="1"
              />
              <Radio
                color="status.1"
                iconColor="dark.4"
                icon={CheckIcon}
                name="2"
                value="2"
              />
              <Radio
                color="status.2"
                iconColor="dark.4"
                icon={CheckIcon}
                name="3"
                value="3"
              />
              <Radio
                color="status.3"
                iconColor="dark.4"
                icon={CheckIcon}
                name="4"
                value="4"
              />
              <Radio
                color="status.4"
                iconColor="dark.4"
                icon={CheckIcon}
                name="5"
                value="5"
              />
              <Radio
                color="status.5"
                iconColor="dark.4"
                icon={CheckIcon}
                name="98"
                value="98"
              />
              <Radio
                color="status.6"
                iconColor="dark.4"
                icon={CheckIcon}
                name="99"
                value="99"
              />
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
      </div>
    </form>
  );
}

export default memo(TermForm);
