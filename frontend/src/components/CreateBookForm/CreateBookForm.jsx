import {
  Button,
  Fieldset,
  FileInput,
  Group,
  NumberInput,
  rem,
  Select,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconBookUpload,
  IconBracketsContain,
  IconHeading,
  IconHeadphones,
  IconLanguage,
  IconLink,
  IconTags,
  IconWorldWww,
} from "@tabler/icons-react";
import classes from "./CreateBookForm.module.css";

function CreateBookForm() {
  return (
    <form className={classes.container}>
      <Select
        withAsterisk
        label="Language"
        leftSection={<IconLanguage />}
        autoFocus
      />
      <TextInput
        withAsterisk
        label="Title"
        leftSection={<IconHeading />}
        disabled
      />
      <Fieldset
        legend="Content"
        flex={1}
        className={classes.content}
        styles={{
          legend: { fontSize: rem(15) },
        }}>
        <Stack wrap="nowrap" gap={rem(5)}>
          <Textarea
            disabled
            label="Text"
            resize="vertical"
            autosize
            minRows={15}
            maxRows={40}
          />
          <p>or</p>
          <FileInput
            disabled
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
              disabled
              label="Import from URL"
              description="Primitive import: it grabs all the headings and text from an HTML page. Likely will include stuff you don't want, so you can edit the resulting text"
              leftSection={<IconWorldWww />}
            />
            <Button variant="filled" disabled>
              Import
            </Button>
          </Group>
        </Stack>
      </Fieldset>

      <NumberInput
        label="Words per page"
        defaultValue={250}
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

      <Group justify="flex-end" mt="sm" gap="xs">
        <Button type="submit" disabled>
          Save
        </Button>
        <Button>Cancel</Button>
      </Group>
    </form>
  );
}

export default CreateBookForm;
