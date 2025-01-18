import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Box, Group, Paper, Text } from "@mantine/core";
import PageContainer from "@common/PageContainer/PageContainer";
import PageTitle from "@common/PageTitle/PageTitle";
import LanguageCards from "@language/components/LanguageCards/LanguageCards";
import DictTabs from "@language/components/DictTabs/DictTabs";
import TermForm from "@term/components/TermForm/TermForm";
import { definedLangInfoQuery } from "@language/api/language";
import { termDataQuery } from "@term/api/term";

function NewEditTermPage() {
  const [newTerm, setNewTerm] = useState("");
  const [params] = useSearchParams();
  const langId = params.get("langId");
  const termId = params.get("termId");
  const { data: language } = useQuery(definedLangInfoQuery(langId));
  const { data: term } = useQuery(termDataQuery(termId));

  const editMode = termId && language && term;

  return (
    <PageContainer width="90%">
      <PageTitle>{termId ? "Edit term" : "Create new term"}</PageTitle>
      {!termId && (
        <LanguageCards
          label="My languages"
          description="Pick a language to add the new term"
        />
      )}

      {language || editMode ? (
        <Group
          justify="center"
          align="flex-start"
          dir={language.isRightToLeft ? "rtl" : "ltr"}>
          <Box flex={0.3}>
            <TermForm
              key={term}
              term={termId ? term : null}
              language={language}
              onSetTerm={setNewTerm}
            />
          </Box>
          <Box flex={0.7} h={600}>
            {newTerm || editMode ? (
              <DictTabs
                key={termId ? term.text : newTerm}
                language={language}
                term={termId ? term.text : newTerm}
              />
            ) : (
              <Placeholder
                label="Type term text and click the lookup button to load dictionaries"
                height={600}
              />
            )}
          </Box>
        </Group>
      ) : (
        !termId && (
          <Placeholder
            label="Select a language to show the term form"
            height={600}
          />
        )
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

export default NewEditTermPage;
