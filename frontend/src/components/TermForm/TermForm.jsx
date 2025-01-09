import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Group,
  TextInput,
  Textarea,
  TagsInput,
  Checkbox,
  rem,
  Collapse,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";
import StatusRadio from "./StatusRadio";
import TagsField from "../TagsField/TagsField";
import TermImage from "./TermImage";
import { tagSuggestionsQuery } from "../../queries/term";
import classes from "./TermForm.module.css";

function TermForm({
  form,
  language = { id: 0, isRightToLeft: false, showPronunciation: true },
  translationFieldRef = {},
  onSetActiveTerm = null,
  loadDictsButton = null,
}) {
  const { data: tags } = useQuery(tagSuggestionsQuery);
  const dir = language.isRightToLeft ? "rtl" : "ltr";

  const [notesOpened, setNotesOpened] = useState(false);

  return (
    <form>
      <div className={classes.container}>
        <TextInput
          wrapperProps={{ dir: dir }}
          placeholder="Term"
          withAsterisk
          rightSection={loadDictsButton}
          key={form.key("text")}
          {...form.getInputProps("text")}
        />
        <TagsField
          form={form}
          tags={form.getValues().parents}
          activeTermText={form.getValues().originalText}
          onSetActiveTerm={onSetActiveTerm}
          languageId={language.id}
        />
        {language.showPronunciation && (
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
            rightSection={
              <Tooltip label="Notes">
                <ActionIcon
                  color="dark.4"
                  size="sm"
                  variant="subtle"
                  onClick={() => setNotesOpened((v) => !v)}>
                  <IconNotes />
                </ActionIcon>
              </Tooltip>
            }
            rightSectionPointerEvents="all"
            rightSectionProps={{
              style: {
                height: "fit-content",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                padding: 2,
              },
            }}
          />
          {form.getValues().currentImg && (
            <TermImage
              src={`http://localhost:5001${form.getValues().currentImg}`}
            />
          )}
        </div>
        <Collapse in={notesOpened}>
          <Textarea
            resize="vertical"
            placeholder="Notes"
            autosize
            spellCheck={false}
            autoCapitalize="off"
            minRows={3}
          />
        </Collapse>
        <Group dir="ltr" gap="md" style={{ rowGap: rem(7) }}>
          <StatusRadio form={form} />
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
