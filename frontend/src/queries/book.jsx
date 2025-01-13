import { bookmarksQuery } from "./bookmark";
import { definedLangInfoQuery } from "./language";
import { settingsQuery } from "./settings";

const bookQuery = (id) => ({
  queryKey: ["bookData", id],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/books/${id}`);
    return await response.json();
  },
  refetchOnWindowFocus: false,
});

const pageQuery = (bookId, pageNum) => ({
  queryKey: ["pageData", bookId, pageNum],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/books/${bookId}/pages/${pageNum}`
    );
    return await response.json();
  },
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

const bookStatsQuery = (id) => ({
  queryKey: ["bookStats", id],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/books/${id}/stats`);
    return await response.json();
  },
  enabled: id !== null,
});

function loader(queryClient) {
  return async ({ params }) => {
    const bq = bookQuery(params.id);
    const pq = pageQuery(params.id, params.page);

    const bookData =
      queryClient.getQueryData(bq.queryKey) ??
      (await queryClient.fetchQuery(bq));

    const pageData =
      queryClient.getQueryData(pq.queryKey) ??
      (await queryClient.fetchQuery(pq));

    const settingsData =
      queryClient.getQueryData(settingsQuery.queryKey) ??
      (await queryClient.fetchQuery(settingsQuery));

    const languageQ = definedLangInfoQuery(bookData?.languageId);
    const languageData =
      queryClient.getQueryData(languageQ.queryKey) ??
      (await queryClient.fetchQuery(languageQ));

    const bookmarksQ = bookmarksQuery(params.id);
    const bookmarksData =
      queryClient.getQueryData(bookmarksQ.queryKey) ??
      (await queryClient.fetchQuery(bookmarksQ));

    return { bookData, pageData, settingsData, languageData, bookmarksData };
  };
}

export { loader, bookQuery, pageQuery, bookStatsQuery };
