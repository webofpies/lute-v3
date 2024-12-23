import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  Textarea,
  TagsInput,
  Radio,
  Checkbox,
  rem,
  Text,
} from "@mantine/core";
import { IconCheck, IconMinus } from "@tabler/icons-react";
import TagsField from "../TagsField/TagsField";
import TermImage from "./TermImage";
import { tagSuggestionsQuery } from "../../queries/term";
import classes from "./TermForm.module.css";

const radioIcon = (label, props) => (
  <Text {...props} lh={1} ta="center">
    {label}
  </Text>
);

const radios = [
  {
    value: "1",
    icon: (props) => radioIcon(1, props),
  },
  {
    value: "2",
    icon: (props) => radioIcon(2, props),
  },
  {
    value: "3",
    icon: (props) => radioIcon(3, props),
  },
  {
    value: "4",
    icon: (props) => radioIcon(4, props),
  },
  {
    value: "5",
    icon: (props) => radioIcon(5, props),
  },
  {
    value: "99",
    icon: IconCheck,
  },
  {
    value: "98",
    icon: IconMinus,
  },
];

function TermForm({ termData, translationFieldRef, book, onSetActiveTerm }) {
  const { data: tags } = useQuery(tagSuggestionsQuery());
  const dir = book.isRightToLeft ? "rtl" : "ltr";

  const form = useForm({
    initialValues: {
      ...termData,
      status: String(termData.status),
    },
    enhanceGetInputProps: ({ form, field }) => {
      if (field === "syncStatus") {
        const parentsCount = form.getValues().parents.length;

        if (!parentsCount || parentsCount > 1)
          return {
            disabled: true,
            checked: false,
          };

        return { disabled: false, checked: form.getValues().syncStatus };
      }
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
        <TagsField
          form={form}
          tags={termData.parents}
          activeTermText={termData.originalText}
          onSetActiveTerm={onSetActiveTerm}
          book={book}
        />
        {book.showPronunciation && (
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
            minRows={2}
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
        <Group gap="md" style={{ rowGap: rem(7) }}>
          <Radio.Group
            name="status"
            key={form.key("status")}
            {...form.getInputProps("status")}>
            <Group justify="flex-start" gap={2} wrap="nowrap">
              {radios.map((radio) => (
                <Radio
                  style={{ "--radio-icon-size": rem(16) }}
                  size="md"
                  iconColor="dark.4"
                  key={radio.value}
                  color={`var(--lute-color-highlight-status${radio.value})`}
                  icon={radio.icon}
                  name={radio.value}
                  value={radio.value}
                  ml={radio.value === radios[radios.length - 1].value ? 10 : 0}
                />
              ))}
            </Group>
          </Radio.Group>
          <Checkbox
            styles={{ label: { paddingInlineStart: rem(5) } }}
            size="xs"
            label="Link to parent"
            key={form.key("syncStatus")}
            {...form.getInputProps("syncStatus", { type: "checkbox" })}
          />
        </Group>
        <TagsInput
          clearable
          data={tags || []}
          placeholder="Tags"
          maxDropdownHeight={200}
          key={form.key("termTags")}
          {...form.getInputProps("termTags")}
        />
        <Group justify="flex-end" mt="sm" gap="xs" wrap="nowrap">
          <Button>Delete</Button>
          <Button type="submit">Save</Button>
        </Group>
      </div>
    </form>
  );
}

export default memo(TermForm);
