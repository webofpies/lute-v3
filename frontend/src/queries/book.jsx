import { bookmarksQuery } from "./bookmark";
import { definedLangInfoQuery } from "./language";
import { settingsQuery, softwareInfoQuery } from "./settings";

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
    const bookData = await queryClient.ensureQueryData(bookQuery(params.id));
    const pageData = await queryClient.ensureQueryData(
      pageQuery(params.id, params.page)
    );
    const settingsData = await queryClient.ensureQueryData(settingsQuery);
    const languageData = await queryClient.ensureQueryData(
      definedLangInfoQuery(bookData?.languageId)
    );
    const bookmarksData = await queryClient.ensureQueryData(
      bookmarksQuery(params.id)
    );
    const softwareInfoData =
      await queryClient.ensureQueryData(softwareInfoQuery);

    return {
      bookData,
      pageData,
      settingsData,
      languageData,
      bookmarksData,
      softwareInfoData,
    };
  };
}

export { loader, bookQuery, pageQuery, bookStatsQuery };
