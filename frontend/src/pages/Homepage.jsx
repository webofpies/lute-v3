import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useComputedColorScheme } from "@mantine/core";
import BookTable from "../components/BookTable/BookTable";
import { settingsQuery } from "../queries/settings";
import { applyLuteHighlights } from "../misc/actions";
import { allBooksQuery } from "../queries/books";
import { bookStatsQuery } from "../queries/book";

function Homepage() {
  const colorScheme = useComputedColorScheme();
  const { data: settings } = useQuery(settingsQuery());
  const books = useQuery(allBooksQuery());
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    applyLuteHighlights(settings.highlights.status, colorScheme);
    applyLuteHighlights(settings.highlights.general, colorScheme);
  }, [colorScheme, settings.highlights]);

  useEffect(() => {
    if (books.isSuccess) {
      setTableData(books.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books.isSuccess]);

  const allStats = useQueries({
    queries: (books.data || []).map((book) => bookStatsQuery(book.id)),
  });
  useEffect(() => {
    if (books.isSuccess) {
      const allStatsReady = allStats.every((stat) => stat.data);
      if (allStatsReady) {
        setTableData((data) =>
          data.map((d, index) => ({
            ...d,
            status: allStats[index].data || d.status,
          }))
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allStats.map((stat) => stat.isSuccess).join(","), books.isSuccess]);

  return <BookTable data={tableData} />;
}

export default Homepage;
