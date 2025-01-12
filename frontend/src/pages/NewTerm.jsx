import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Box, Group, Paper, Text } from "@mantine/core";

import DictTabs from "../components/DictTabs/DictTabs";
import LanguageCards from "../components/LanguageCards/LanguageCards";
import PageContainer from "../components/PageContainer/PageContainer";
import PageTitle from "../components/PageTitle/PageTitle";
import TermForm from "../components/TermForm/TermForm";
import { definedLangInfoQuery } from "../queries/language";

function NewTerm() {
  const [newTerm, setNewTerm] = useState("");
  const [params] = useSearchParams();
  const langId = params.get("id");
  const { data: language } = useQuery(definedLangInfoQuery(langId));

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
            <TermForm language={language} onSetTerm={setNewTerm} />
          </Box>
          <Box flex={0.7} h={600}>
            {newTerm ? (
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
