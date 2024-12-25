import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ActionIcon, Box, Group, Paper, Text, Tooltip } from "@mantine/core";
import { IconVocabulary } from "@tabler/icons-react";
import DictTabs from "../components/DictTabs/DictTabs";
import LanguageCards from "../components/LanguageCards/LanguageCards";
import PageContainer from "../components/PageContainer/PageContainer";
import PageTitle from "../components/PageTitle/PageTitle";
import TermForm from "../components/TermForm/TermForm";
import { languageInfoQuery } from "../queries/language";
import { useTermForm } from "../hooks/term";

const term = {
  text: "",
  textLC: "",
  originalText: "",
  status: "1",
  translation: "",
  romanization: "",
  syncStatus: "",
  termTags: [],
  parents: [],
  currentImg: "",
};

function NewTerm() {
  const [newTerm, setNewTerm] = useState("");
  const [params] = useSearchParams();
  const langId = params.get("id");
  const { data: language } = useQuery(languageInfoQuery(langId));

  const form = useTermForm(term);

  function handleLoadDictionaries() {
    const text = form.getValues().text;
    text !== "" && setNewTerm(text);
  }

  const loadDictsButton = (
    <Tooltip label="Load dictionaries with the term">
      <ActionIcon
        disabled={form.getValues().text === ""}
        variant="default"
        onClick={handleLoadDictionaries}>
        <IconVocabulary />
      </ActionIcon>
    </Tooltip>
  );

  useEffect(() => {
    if (form.getValues.text === "") {
      setNewTerm("");
    }
  }, [form.getValues.text]);

  return (
    <PageContainer width="90%">
      <PageTitle>Create new term</PageTitle>
      <LanguageCards
        label="My languages"
        description="Pick a language to add the new term"
      />

      {language ? (
        <Group
          justify="center"
          align="flex-start"
          dir={language.isRightToLeft ? "rtl" : "ltr"}>
          <Box flex={0.3}>
            <TermForm
              form={form}
              language={language}
              loadDictsButton={loadDictsButton}
            />
          </Box>
          <Box flex={0.7} h={600}>
            {newTerm && form.getValues().text !== "" ? (
              <DictTabs language={language} term={newTerm} />
            ) : (
              <Placeholder
                label="Type term text and click the lookup button to load dictionaries"
                height={600}
              />
            )}
          </Box>
        </Group>
      ) : (
        <Placeholder
          label="Select a language to show the term form"
          height={600}
        />
      )}
    </PageContainer>
  );
}

function Placeholder({ label, height }) {
  return (
    <Paper
      flex={0.3}
      h={height}
      shadow="xs"
      withBorder
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text c="dimmed" size="sm">
        {label}
      </Text>
    </Paper>
  );
}

export default NewTerm;
