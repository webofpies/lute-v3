import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Modal, useComputedColorScheme } from "@mantine/core";
import BooksTable from "@book/components/BooksTable/BooksTable";
import PageContainer from "@common/PageContainer/PageContainer";
import { settingsQuery, initialQuery } from "@settings/api/settings";
import { applyLuteHighlights } from "@actions/general";
import DemoNotice from "../components/DemoNotice/DemoNotice";
import Welcome from "../components/Modals/Welcome";

function HomePage() {
  const colorScheme = useComputedColorScheme();

  const { data: settings } = useQuery(settingsQuery);
  const { data: initial } = useQuery(initialQuery);

  useEffect(() => {
    applyLuteHighlights(settings.highlights.status, colorScheme);
    applyLuteHighlights(settings.highlights.general, colorScheme);
  }, [colorScheme, settings.highlights]);

  return (
    <>
      {/* after user wipes off or deactivates demo mode tutorialBookId is set to null */}
      {initial.tutorialBookId && (
        <Box pl={20} pr={20} pb={10}>
          <DemoNotice tutorialBookId={initial.tutorialBookId} />
        </Box>
      )}
      <Modal
        trapFocus={false}
        opened={!initial.haveLanguages}
        title="Welcome to Lute"
        size="auto"
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}>
        <Welcome />
      </Modal>

      <PageContainer>
        <BooksTable
          languageChoices={initial.languageChoices}
          tagChoices={initial.bookTags}
        />
      </PageContainer>
    </>
  );
}

export default HomePage;
