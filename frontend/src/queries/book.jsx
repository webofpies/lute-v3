import { languageInfoQuery } from "./language";
import { settingsQuery } from "./settings";

const bookQuery = (id) => ({
  queryKey: ["bookData", id],
  queryFn: async () => {
    const bookResponse = await fetch(`http://localhost:5001/api/books/${id}`);
    const book = await bookResponse.json();
    return book;
  },
  refetchOnWindowFocus: false,
});

const pageQuery = (bookId, pageNum) => ({
  queryKey: ["pageData", bookId, pageNum],
  queryFn: async () => {
    const pageResponse = await fetch(
      `http://localhost:5001/api/books/${bookId}/pages/${pageNum}`
    );
    const pageData = await pageResponse.json();
    return pageData;
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

    const languageQ = languageInfoQuery(bookData?.languageId);
    const languageData =
      queryClient.getQueryData(languageQ.queryKey) ??
      (await queryClient.fetchQuery(languageQ));

    return { bookData, pageData, settingsData, languageData };
  };
}

export { loader, bookQuery, pageQuery, bookStatsQuery };
