import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigation, useSearchParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Fieldset,
  Group,
  LoadingOverlay,
  rem,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconAbc,
  IconAlt,
  IconCut,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";
import {
  definedListQueryObj,
  parsersQueryObj,
  predefinedListQueryObj,
  predefinedOptionsObj,
  definedOptionsObj,
} from "../../queries/language";
import LanguageSelect from "../LanguageSelect/LanguageSelect";
import DictionaryBar from "../DictionaryBar/DictionaryBar";
import LanguageCards from "../LanguageCards/LanguageCards";
import classes from "./LanguageForm.module.css";

function LanguageForm() {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const [params] = useSearchParams();
  const openedFromLanguages = pathname === "/languages";
  const predefinedLang = params.get("predef");
  const definedLang = params.get("def");
  const predefinedOptionsQuery = useQuery(predefinedOptionsObj(predefinedLang));
  const definedOptionsQuery = useQuery(definedOptionsObj(definedLang));

  const { data: defined } = useQuery(definedListQueryObj());
  const { data: predefined } = useQuery(predefinedListQueryObj());
  const { data: parsers } = useQuery(parsersQueryObj());

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      right_to_left: false,
      show_romanization: false,
      parser_type: "spacedel",
      word_chars: "a-zA-ZÀ-ÖØ-öø-ȳáéíóúÁÉÍÓÚñÑ",
      character_substitutions: "´='|`='|’='|‘='|...=…|..=‥",
      split_sentences: ".!?",
      split_sentence_exceptions: "Mr.|Mrs.|Dr.|[A-Z].|Vd.|Vds.",
      dictionaries: [
        {
          for: "terms",
          type: "embedded",
          url: "",
          active: true,
          key: randomId(),
        },
        {
          for: "sentences",
          type: "popup",
          url: "",
          active: true,
          key: randomId(),
        },
      ],
    },
  });

  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  });

  useEffect(() => {
    if (predefinedOptionsQuery.isSuccess) {
      const { dictionaries, ...rest } = predefinedOptionsQuery.data;
      form.setValues(rest);

      form.setFieldValue("dictionaries", []);

      dictionaries.forEach((dict, index) =>
        form.insertListItem("dictionaries", { ...dict, key: randomId() }, index)
      );
    }
  }, [predefinedOptionsQuery.data, predefinedOptionsQuery.isSuccess]);

  useEffect(() => {
    if (definedOptionsQuery.isSuccess) {
      const { dictionaries, ...rest } = definedOptionsQuery.data;
      form.setValues(rest);

      form.setFieldValue("dictionaries", []);

      dictionaries.forEach((dict, index) =>
        form.insertListItem("dictionaries", { ...dict, key: randomId() }, index)
      );
    }
  }, [definedOptionsQuery.data, definedOptionsQuery.isSuccess]);

  return (
    <form>
      {openedFromLanguages && (
        <>
          <Text fw={700} fz={rem(22)} mb={rem(10)}>
            My languages
          </Text>
          <LanguageCards languages={defined} />
        </>
      )}
      <Text fw={700} fz={rem(18)}>
        Settings
      </Text>
      <LanguageSelect form={form} predefined={predefined} />
      <Box pos="relative" className={classes.container}>
        <LoadingOverlay
          visible={
            predefinedLang
              ? predefinedOptionsQuery.isFetching ||
                predefinedOptionsQuery.isPending
              : false
          }
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Fieldset
          variant="filled"
          legend="Dictionaries"
          styles={{
            legend: { fontSize: rem(15) },
          }}>
          <Group align="flex-start" justify="flex-start" gap="xs" wrap="nowrap">
            <ActionIcon
              variant="transparent"
              color="green.6"
              onClick={() =>
                form.insertListItem("dictionaries", {
                  for: "terms",
                  type: "embedded",
                  url: "",
                  active: false,
                  key: randomId(),
                })
              }>
              <IconSquareRoundedPlusFilled />
            </ActionIcon>

            <ScrollArea.Autosize mah={300} offsetScrollbars="y" flex={1}>
              <Stack gap={rem(5)}>
                {form.getValues().dictionaries.map((dict, index) => (
                  <DictionaryBar key={dict.key} form={form} index={index} />
                ))}
              </Stack>
            </ScrollArea.Autosize>
          </Group>
        </Fieldset>
        <Checkbox
          label="Show pronunciation field"
          key={form.key("show_romanization")}
          {...form.getInputProps("show_romanization", { type: "checkbox" })}
        />
        <Checkbox
          label="Is right-to-left"
          key={form.key("right_to_left")}
          {...form.getInputProps("right_to_left", { type: "checkbox" })}
        />
        <Select
          w="fit-content"
          label="Parse as"
          withCheckIcon={false}
          searchable={false}
          data={parsers}
          key={form.key("parser_type")}
          {...form.getInputProps("parser_type")}
        />
        <TextInput
          label="Character substitutions"
          leftSection={<IconAlt />}
          key={form.key("character_substitutions")}
          {...form.getInputProps("character_substitutions")}
        />
        <Group align="flex-end">
          <TextInput
            flex={1}
            label="Split sentences at"
            description="default: all Unicode sentence terminators"
            leftSection={<IconCut />}
            key={form.key("split_sentences")}
            {...form.getInputProps("split_sentences")}
          />
          <TextInput
            flex={2}
            label="Exceptions"
            key={form.key("split_sentence_exceptions")}
            {...form.getInputProps("split_sentence_exceptions")}
          />
        </Group>
        <TextInput
          label="Word characters"
          description="default: all Unicode letters and marks"
          leftSection={<IconAbc />}
          key={form.key("word_chars")}
          {...form.getInputProps("word_chars")}
        />

        <Group justify="flex-end" mt="sm" gap="xs">
          <Button type="submit" disabled>
            Save
          </Button>
          <Button>Cancel</Button>
        </Group>
      </Box>
    </form>
  );
}

export default LanguageForm;
