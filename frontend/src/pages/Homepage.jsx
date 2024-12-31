import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Box, Modal, useComputedColorScheme } from "@mantine/core";
import BookTable from "../components/BookTable/BookTable";
import DemoNotice from "../components/DemoNotice/DemoNotice";
import Welcome from "../components/Modals/Welcome";
import { settingsQuery, initialQuery } from "../queries/settings";
import { applyLuteHighlights } from "../misc/actions";
import { allBooksQuery } from "../queries/books";
import { bookStatsQuery } from "../queries/book";

function Homepage() {
  const colorScheme = useComputedColorScheme();

  const [booksWithStats, setBooksWithStats] = useState(null);

  const { data: settings } = useQuery(settingsQuery());
  const { data: books } = useQuery(allBooksQuery());
  const { data: initial } = useQuery(initialQuery);

  useEffect(() => {
    applyLuteHighlights(settings.highlights.status, colorScheme);
    applyLuteHighlights(settings.highlights.general, colorScheme);
  }, [colorScheme, settings.highlights]);

  const allStats = useQueries({
    queries: books.map((book) => bookStatsQuery(book.id)),
  });
  const succesStr = allStats.map((stat) => stat.isSuccess).join(",");
  useEffect(() => {
    if (allStats.every((stat) => stat.data)) {
      setBooksWithStats(
        books.map((d, index) => ({
          ...d,
          status: allStats[index].data || d.status,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [succesStr]);

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

      {books.length > 0 && <BookTable data={booksWithStats || books} />}
    </>
  );
}

export default Homepage;
