const bookmarksQuery = (id) => ({
  queryKey: ["bookmarks", id],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/bookmarks/${id}`);
    return await response.json();
  },
  refetchOnWindowFocus: false,
  enabled: !!id,
});

export { bookmarksQuery };
