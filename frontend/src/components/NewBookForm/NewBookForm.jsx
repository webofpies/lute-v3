import { useEffect } from "react";
import { useNavigation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { nprogress } from "@mantine/nprogress";
import {
  ActionIcon,
  Button,
  Fieldset,
  FileInput,
  Group,
  NumberInput,
  rem,
  Stack,
  TagsInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconBookUpload,
  IconBracketsContain,
  IconHeading,
  IconHeadphones,
  IconLink,
  IconSquareRoundedPlusFilled,
  IconTags,
  IconWorldWww,
} from "@tabler/icons-react";
import LanguageCards from "../LanguageCards/LanguageCards";
import { definedListQueryObj, definedOptionsObj } from "../../queries/language";
import ImportURLInfo from "./ImportURLInfo";
import classes from "./NewBookForm.module.css";

function NewBookForm({ openDrawer }) {
  const navigation = useNavigation();
  const [params] = useSearchParams();
  const definedLang = params.get("def");
  const { data: defined } = useQuery(definedListQueryObj());
  const definedOptionsQuery = useQuery(definedOptionsObj(definedLang));

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      wordsPerPage: 250,
    },
  });

  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  }, [navigation.state]);

  return (
    <form className={classes.container}>
      <Group gap={5} wrap="nowrap">
        <Text fw={500} fz={20}>
          Language
        </Text>
        <ActionIcon variant="transparent" color="green.6" onClick={openDrawer}>
          <IconSquareRoundedPlusFilled />
        </ActionIcon>
      </Group>
      <LanguageCards languages={defined} />
      <Text fw={500} fz={20}>
        Settings
      </Text>
      <TextInput
        wrapperProps={{
          dir: definedOptionsQuery?.data?.right_to_left ? "rtl" : "ltr",
        }}
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
        className={classes.content}
        styles={{
          legend: { fontSize: rem(15) },
        }}>
        <Stack wrap="nowrap" gap={5}>
          <Textarea
            wrapperProps={{
              dir: definedOptionsQuery?.data?.right_to_left ? "rtl" : "ltr",
            }}
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

export default NewBookForm;
