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

export { bookQuery, pageQuery, bookStatsQuery, allBooksQuery };
