import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Group,
  TextInput,
  Textarea,
  TagsInput,
  Checkbox,
  rem,
  Collapse,
  ActionIcon,
  Tooltip,
  Popover,
  UnstyledButton,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconLetterCaseLower,
  IconNotes,
  IconSpeakerphone,
  IconVocabulary,
} from "@tabler/icons-react";
import StatusRadio from "./StatusRadio";
import TagsField from "../TagsField/TagsField";
import FormButtons from "../FormButtons/FormButtons";
import { tagSuggestionsQuery } from "../../queries/term";
import { moveCursorToEnd } from "../../misc/utils";
import classes from "./TermForm.module.css";

function TermForm({
  term = null,
  language = { id: 0, isRightToLeft: false, showPronunciation: true },
  translationFieldRef = {},
  onSetActiveTerm = null, // selected word from the page text
  onSetTerm = null, // typed text in the term field
}) {
  const { data: tags } = useQuery(tagSuggestionsQuery);
  const dir = language.isRightToLeft ? "rtl" : "ltr";

  const form = useForm({
    initialValues: term && {
      ...term,
      status: String(term.status),
    },
    enhanceGetInputProps: ({ form, field }) => {
      if (!form.initialized) return;

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
  });

  const [notesOpened, setNotesOpened] = useState(!term);
  const [pronunciationOpened, setPronunciationOpened] = useState(
    term ? language.showPronunciation : true
  );
  const [parents, setParents] = useState(form.getValues().parents || []);

  function handleParentSubmit(val) {
    const obj = JSON.parse(val);

    const newParents = [...parents, obj.value];
    const singleParent = newParents.length === 1;

    if (singleParent) {
      form.setFieldValue("status", String(obj.status));
    }
    form.setFieldValue("syncStatus", singleParent);

    setParents(newParents);
  }

  return (
    <form>
      <div className={classes.container}>
        <Group gap={4} flex={1}>
          <TextInput
            readOnly={!!term}
            wrapperProps={{ dir: dir }}
            placeholder="Term"
            withAsterisk
            flex={1}
            rightSection={
              !term && (
                <LoadDictsButton
                  enabled={form.getValues().text}
                  onClick={() => onSetTerm(form.getValues().text)}
                />
              )
            }
            rightSectionWidth={50}
            key={form.key("text")}
            {...form.getInputProps("text")}
          />
          {term && (
            <>
              <ToLowerCaseButton
                onClick={() =>
                  form.setFieldValue(
                    "text",
                    form.getValues().text.toLowerCase()
                  )
                }
              />
              <PronunciationButton
                onToggle={() => setPronunciationOpened((v) => !v)}
              />
              <NotesButton onToggle={() => setNotesOpened((v) => !v)} />
            </>
          )}
        </Group>
        <TagsField
          termText={form.getValues().originalText}
          values={parents}
          onSetValues={(values) => {
            setParents(values);
            form.setFieldValue("parents", values);
          }}
          onSubmitParent={handleParentSubmit}
          onSetActiveTerm={onSetActiveTerm}
          languageId={language.id}
        />
        <Collapse in={pronunciationOpened}>
          <TextInput
            placeholder="Pronunciation"
            key={form.key("romanization")}
            {...form.getInputProps("romanization")}
          />
        </Collapse>
        <div className={classes.flex}>
          <Textarea
            wrapperProps={{ dir: dir }}
            placeholder="Translation"
            resize="vertical"
            flex={1}
            ref={translationFieldRef}
            onFocusCapture={moveCursorToEnd}
            minRows={2}
            autosize
            spellCheck={false}
            autoCapitalize="off"
            autoFocus
            key={form.key("translation")}
            {...form.getInputProps("translation")}
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

        <FormButtons discardLabel={term ? "Delete" : null} />
      </div>
    </form>
  );
}

function LoadDictsButton({ enabled, onClick }) {
  return (
    <Tooltip label="Load dictionaries with the term">
      <ActionIcon disabled={!enabled} variant="subtle" onClick={onClick}>
        <IconVocabulary />
      </ActionIcon>
    </Tooltip>
  );
}

function NotesButton({ onToggle }) {
  return (
    <Tooltip label="Show notes">
      <ActionIcon size="md" variant="subtle" onClick={onToggle}>
        <IconNotes />
      </ActionIcon>
    </Tooltip>
  );
}

function PronunciationButton({ onToggle }) {
  return (
    <Tooltip label="Show pronunciation">
      <ActionIcon size="md" variant="subtle" onClick={onToggle}>
        <IconSpeakerphone />
      </ActionIcon>
    </Tooltip>
  );
}

function ToLowerCaseButton({ onClick }) {
  return (
    <Tooltip label="Make lowercase">
      <ActionIcon size="md" variant="subtle" onClick={onClick}>
        <IconLetterCaseLower />
      </ActionIcon>
    </Tooltip>
  );
}

function TermImage({ src }) {
  return (
    <Popover position="left">
      <Popover.Target>
        <UnstyledButton>
          <Image radius={5} w={50} h={50} src={src} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Image mah="200px" src={src} />
      </Popover.Dropdown>
    </Popover>
  );
}

export default memo(TermForm);
