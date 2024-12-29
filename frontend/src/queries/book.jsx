import { languageInfoQuery } from "./language";
import { settingsQuery } from "./settings";

function loader(queryClient) {
  return async ({ params }) => {
    const bq = bookQuery(params.id);

    const bookData =
      queryClient.getQueryData(bq.queryKey) ??
      (await queryClient.fetchQuery(bq));

    const pq = pageQuery(params.id, params.page);

    const pageData =
      queryClient.getQueryData(pq.queryKey) ??
      (await queryClient.fetchQuery(pq));

    const settingsQ = settingsQuery();

    const settingsData =
      queryClient.getQueryData(settingsQ.queryKey) ??
      (await queryClient.fetchQuery(settingsQ));

    const languageQ = languageInfoQuery(bookData?.languageId);

    const languageData =
      queryClient.getQueryData(languageQ.queryKey) ??
      (await queryClient.fetchQuery(languageQ));

    return { bookData, pageData, settingsData, languageData };
  };
}

function bookQuery(id) {
  return {
    queryKey: ["bookData", id],
    queryFn: async () => {
      const bookResponse = await fetch(`http://localhost:5001/api/books/${id}`);
      const book = await bookResponse.json();
      return book;
    },
    refetchOnWindowFocus: false,
  };
}

function pageQuery(bookId, pageNum) {
  return {
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
  };
}

function bookStatsQuery(id) {
  return {
    queryKey: ["bookStats", id],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/books/${id}/stats`
      );
      return await response.json();
    },
    enabled: id !== null,
  };
}

export { loader, bookQuery, pageQuery, bookStatsQuery };
