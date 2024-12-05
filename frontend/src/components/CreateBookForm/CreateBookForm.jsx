import { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { nprogress } from "@mantine/nprogress";
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
import { definedListQueryObj } from "../../queries/language";
import classes from "./CreateBookForm.module.css";

function CreateBookForm({ openDrawer }) {
  const navigation = useNavigation();
  const { data: defined } = useQuery(definedListQueryObj());
  const [disabled, setDisabled] = useState(true);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      wordsPerPage: 250,
    },
  });

  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  });

  return (
    <form className={classes.container}>
      <Group align="flex-end" wrap="nowrap">
        <Select
          onOptionSubmit={() => setDisabled(false)}
          allowDeselect={false}
          required
          withAsterisk
          label="Language"
          placeholder="Pick a language"
          searchable={true}
          withCheckIcon={false}
          leftSection={<IconLanguage />}
          data={defined.map((lang) => lang.name)}
        />
        <Button variant="filled" onClick={openDrawer}>
          New
        </Button>
      </Group>
      <TextInput
        disabled={disabled}
        required
        withAsterisk
        label="Title"
        leftSection={<IconHeading />}
      />
      <Fieldset
        disabled={disabled}
        variant="filled"
        legend="Content"
        flex={1}
        className={classes.content}
        styles={{
          legend: { fontSize: rem(15) },
        }}>
        <Stack wrap="nowrap" gap={rem(5)}>
          <Textarea
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
              description="Grab all the headings and text from an HTML page. Likely will include unneeded stuff. You are able to edit the resulting text"
              leftSection={<IconWorldWww />}
            />
            <Button variant="filled">Import</Button>
          </Group>
        </Stack>
      </Fieldset>

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
