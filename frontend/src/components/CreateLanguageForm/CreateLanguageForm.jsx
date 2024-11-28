import { useState } from "react";
import {
  ActionIcon,
  Button,
  Checkbox,
  Fieldset,
  Group,
  rem,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconAbc,
  IconAlt,
  IconCut,
  IconLanguage,
  IconListSearch,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";
import DictionaryBar from "./DictionaryBar";
import classes from "./CreateLanguageForm.module.css";

function CreateLanguageForm({ predefined }) {
  const [dicts, setDicts] = useState([0]);

  return (
    <form className={classes.container}>
      <Text fw={700} fz={rem(22)} mb="xs">
        Create new language
      </Text>
      <Group align="flex-end">
        <Select
          label="Load from predefined"
          searchable={true}
          leftSection={<IconListSearch />}
          data={predefined}
        />
        <Button variant="filled" disabled>
          Load
        </Button>
      </Group>
      <TextInput withAsterisk label="Name" leftSection={<IconLanguage />} />
      <Fieldset
        variant="filled"
        legend="Dictionaries"
        styles={{
          legend: { fontSize: rem(15) },
        }}>
        <Group
          align="flex-start"
          justify="space-between"
          gap="xs"
          wrap="nowrap">
          <ActionIcon
            variant="transparent"
            color="green.6"
            onClick={() => setDicts((dicts) => [...dicts, Date.now()])}>
            <IconSquareRoundedPlusFilled />
          </ActionIcon>
          <Stack gap={rem(5)} flex={1}>
            {dicts.map((id) => (
              <DictionaryBar
                key={id}
                onRemove={() =>
                  setDicts((dicts) =>
                    dicts.length > 1
                      ? dicts.filter((dict) => dict !== id)
                      : dicts
                  )
                }
              />
            ))}
          </Stack>
        </Group>
      </Fieldset>
      <Checkbox label="Show pronunciation field" />
      <Checkbox label="Is right-to-left" />
      <TextInput
        label="Character substitutions"
        defaultValue="´='|`='|’='|‘='|...=…|..=‥"
        leftSection={<IconAlt />}
      />
      <Group align="flex-end">
        <TextInput
          label="Split sentences at"
          defaultValue=".!?"
          description="default: all Unicode sentence terminators"
          leftSection={<IconCut />}
        />
        <TextInput
          label="Exceptions"
          defaultValue="Mr.|Mrs.|Dr.|[A-Z].|Vd.|Vds."
        />
      </Group>
      <TextInput
        label="Word characters"
        description="default: all Unicode letters and marks"
        defaultValue="a-zA-ZÀ-ÖØ-öø-ȳáéíóúÁÉÍÓÚñÑ"
        leftSection={<IconAbc />}
      />

      <Group justify="flex-end" mt="sm" gap="xs">
        <Button type="submit" disabled>
          Save
        </Button>
        <Button>Cancel</Button>
      </Group>
    </form>
  );
}

export default CreateLanguageForm;
