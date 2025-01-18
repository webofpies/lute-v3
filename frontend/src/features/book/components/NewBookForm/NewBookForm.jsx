import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import {
  ActionIcon,
  Button,
  Fieldset,
  FileInput,
  Group,
  NumberInput,
  Paper,
  Popover,
  rem,
  Select,
  Stack,
  TagsInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconBookUpload,
  IconBracketsContain,
  IconCut,
  IconHeading,
  IconHeadphones,
  IconLink,
  IconQuestionMark,
  IconSquareRoundedPlusFilled,
  IconTags,
  IconWorldWww,
} from "@tabler/icons-react";
import LanguageCards from "@language/components/LanguageCards/LanguageCards";
import FormButtons from "@common/FormButtons/FormButtons";
import { defFormSettingsQuery } from "@language/api/language";
import { initialQuery } from "@settings/api/settings";
import classes from "./NewBookForm.module.css";

function NewBookForm({ openDrawer }) {
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const definedLang = langId && langId !== "0";
  const { data } = useQuery(defFormSettingsQuery(langId));
  const { data: initial } = useQuery(initialQuery);
  const dir = data?.right_to_left ? "rtl" : "ltr";

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      wordsPerPage: 250,
      splitBy: "paragraphs",
    },
  });

  const cardsRadioLabel = (
    <Group wrap="nowrap" gap={5} align="center">
      <Text component="span" fw={500} fz="sm">
        Language
      </Text>
      <ActionIcon
        variant="transparent"
        color="green.6"
        onClick={openDrawer}
        size="sm">
        <IconSquareRoundedPlusFilled />
      </ActionIcon>
    </Group>
  );

  return (
    <form className={classes.container}>
      {initial.haveLanguages ? (
        <LanguageCards
          label={cardsRadioLabel}
          description="Choose language for your book or create new"
        />
      ) : (
        cardsRadioLabel
      )}
      <TextInput
        wrapperProps={{ dir: dir }}
        disabled={definedLang ? false : true}
        required
        withAsterisk
        label="Title"
        leftSection={<IconHeading />}
      />
      <Fieldset
        disabled={definedLang ? false : true}
        variant="filled"
        legend="Content"
        flex={1}
        styles={{
          legend: { fontWeight: 500 },
        }}>
        <Stack wrap="nowrap" gap={5}>
          <Textarea
            wrapperProps={{ dir: dir }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            label="Text"
            resize="vertical"
            autosize
            minRows={15}
            maxRows={40}
          />

          <p>or</p>

          <FileInput
            label="Import from file"
            description=".txt, .epub, .pdf, .srt, .vtt"
            accept="text/txt,text/apub,text/pdf,text/srt,text/vtt"
            leftSection={<IconBookUpload />}
            clearable
          />

          <p>or</p>

          <Group align="flex-end">
            <TextInput
              flex={1}
              label="Import from URL"
              leftSection={<IconWorldWww />}
              rightSection={<ImportURLInfo />}
            />
            <Button variant="filled">Import</Button>
          </Group>
        </Stack>
      </Fieldset>

      <Select
        label="Split by"
        data={[
          { value: "paragraphs", label: "Paragraphs" },
          { value: "sentences", label: "Sentences" },
        ]}
        leftSection={<IconCut />}
        withCheckIcon={false}
        searchable={false}
        allowDeselect={false}
        key={form.key("splitBy")}
        {...form.getInputProps("splitBy")}
      />

      <NumberInput
        label="Words per page"
        key={form.key("wordsPerPage")}
        {...form.getInputProps("wordsPerPage")}
        leftSection={<IconBracketsContain />}
      />

      <FileInput
        label="Audio file"
        description=".mp3, .m4a, .wav, .ogg, .opus"
        accept="audio/mpeg,audio/ogg, audio/mp4"
        leftSection={<IconHeadphones />}
        clearable
      />

      <TextInput label="Source URL" leftSection={<IconLink />} />

      <TagsInput label="Tags" leftSection={<IconTags />} />

      <FormButtons />
    </form>
  );
}

function ImportURLInfo() {
  return (
    <Popover position="top" withArrow shadow="sm">
      <Popover.Target>
        <ActionIcon variant="transparent">
          <IconQuestionMark />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Paper maw={500} fz="sm">
          <p style={{ marginBottom: rem(5) }}>
            This import is very primitive -- it grabs <em>all</em> the headings
            and text from an HTML page.
          </p>
          <p>
            This will likely include stuff you don&apos;t want. You are able to
            edit the resulting text
          </p>
        </Paper>
      </Popover.Dropdown>
    </Popover>
  );
}

export default NewBookForm;
