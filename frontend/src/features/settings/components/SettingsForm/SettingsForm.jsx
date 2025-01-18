import { useQuery } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import {
  Button,
  Checkbox,
  Fieldset,
  Group,
  NumberInput,
  rem,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import {
  IconDatabase,
  IconTorii,
  IconNotes,
  IconSpeakerphone,
} from "@tabler/icons-react";
import MeCabInfo from "./MeCabInfo";
import FormButtons from "@common/FormButtons/FormButtons";
import { settingsQuery } from "../../api/settings";

function SettingsForm() {
  const { data: settings } = useQuery(settingsQuery);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      ...settings,
      focusActiveSentence: true,
    },
    enhanceGetInputProps: ({ form, field }) => {
      const enabledField = "backup_enabled";
      if (field.includes("backup") && field !== enabledField) {
        return { disabled: !form.getValues()[enabledField] };
      }
    },
  });

  const fieldsetFz = rem(17);
  return (
    <form>
      <Stack gap={10}>
        <Fieldset
          variant="filled"
          legend="Backup"
          styles={{
            legend: { fontSize: fieldsetFz, fontWeight: 500 },
          }}>
          <Stack gap={5}>
            <Checkbox
              label="Enabled"
              key={form.key("backup_enabled")}
              {...form.getInputProps("backup_enabled", { type: "checkbox" })}
            />
            <TextInput
              label="Directory"
              leftSection={<IconDatabase />}
              key={form.key("backup_dir")}
              {...form.getInputProps("backup_dir")}
            />
            <Checkbox
              label="Run automatically (daily)"
              key={form.key("backup_auto")}
              {...form.getInputProps("backup_auto", { type: "checkbox" })}
            />
            <Checkbox
              label="Warn if backup hasn't run in a week"
              key={form.key("backup_warn")}
              {...form.getInputProps("backup_warn", { type: "checkbox" })}
            />
            <Checkbox
              label="Retain backup count"
              key={form.key("backup_count")}
              {...form.getInputProps("backup_count", { type: "checkbox" })}
            />
          </Stack>
        </Fieldset>
        <Fieldset
          variant="filled"
          legend="Behaviour"
          styles={{
            legend: {
              fontSize: fieldsetFz,
              fontWeight: 500,
            },
          }}>
          <Stack gap={5} align="flex-start">
            <Checkbox
              label="Open translation popup in new tab"
              key={form.key("open_popup_in_new_tab")}
              {...form.getInputProps("open_popup_in_new_tab", {
                type: "checkbox",
              })}
            />
            <Checkbox
              label="Stop audio on term form open"
              key={form.key("stop_audio_on_term_form_open")}
              {...form.getInputProps("stop_audio_on_term_form_open", {
                type: "checkbox",
              })}
            />
            <Checkbox
              label="Focus active sentence"
              key={form.key("focusActiveSentence")}
              {...form.getInputProps("focusActiveSentence", {
                type: "checkbox",
              })}
            />
            <NumberInput
              label="Book stats page sample size"
              leftSection={<IconNotes />}
              key={form.key("stats_calc_sample_size")}
              {...form.getInputProps("stats_calc_sample_size")}
            />
          </Stack>
        </Fieldset>
        <Fieldset
          variant="filled"
          legend="Term popups"
          styles={{
            legend: {
              fontSize: fieldsetFz,
              fontWeight: 500,
            },
          }}>
          <Stack gap={5} align="flex-start">
            <Checkbox
              label="Promote parent translation if possible"
              key={form.key("term_popup_promote_parent_translation")}
              {...form.getInputProps("term_popup_promote_parent_translation", {
                type: "checkbox",
              })}
            />
            <Checkbox
              label="Show component terms"
              key={form.key("term_popup_show_components")}
              {...form.getInputProps("term_popup_show_components", {
                type: "checkbox",
              })}
            />
          </Stack>
        </Fieldset>
        <Fieldset
          variant="filled"
          legend="Japanese"
          styles={{
            legend: { fontSize: fieldsetFz, fontWeight: 500 },
          }}>
          <Stack gap={5}>
            <Group gap={5} align="flex-end" wrap="nowrap">
              <TextInput
                flex={1}
                label="MECAB_PATH environment variable"
                leftSection={<IconTorii />}
                rightSection={<MeCabInfo />}
                key={form.key("mecab_path")}
                {...form.getInputProps("mecab_path")}
              />
              <Button>Test my MeCab configuration</Button>
            </Group>
            <Select
              withCheckIcon={false}
              searchable={false}
              allowDeselect={false}
              leftSection={<IconSpeakerphone />}
              styles={{ root: { alignSelf: "flex-start" } }}
              label="Pronunciation characters"
              data={[
                { label: "Katakana", value: "katakana" },
                { label: "Hiragana", value: "hiragana" },
                { label: "Romanji", value: "romanji" },
              ]}
              key={form.key("japanese_reading")}
              {...form.getInputProps("japanese_reading")}
            />
          </Stack>
        </Fieldset>
      </Stack>

      <FormButtons />
    </form>
  );
}

export default SettingsForm;
