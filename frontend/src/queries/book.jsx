import { definedLangInfoQuery } from "./language";
import { settingsQuery, softwareInfoQuery } from "./settings";

const keys = {
  all: ["books"],
  book: (id) => ["book", id],
  page: (bookId, pageNum) => ["page", bookId, pageNum],
  stats: (id) => ["bookStats", id],
  bookmarks: (id) => ["bookmarks", id],
};

const allBooksQuery = {
  queryKey: keys.all,
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/books`);
    return await response.json();
  },
  staleTime: Infinity,
};

const bookQuery = (id) => ({
  queryKey: keys.book(id),
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/books/${id}`);
    return await response.json();
  },
  refetchOnWindowFocus: false,
});

const pageQuery = (bookId, pageNum) => ({
  queryKey: keys.page(bookId, pageNum),
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
  queryKey: keys.stats(id),
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/books/${id}/stats`);
    return await response.json();
  },
  enabled: id !== null,
});

const bookmarksQuery = (id) => ({
  queryKey: keys.bookmarks(id),
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/bookmarks/${id}`);
    return await response.json();
  },
  refetchOnWindowFocus: false,
  enabled: !!id,
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

export {
  loader,
  bookQuery,
  pageQuery,
  bookStatsQuery,
  allBooksQuery,
  bookmarksQuery,
};
