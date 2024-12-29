function allBooksQuery() {
  return {
    queryKey: ["allBooks"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/api/books`);
      return await response.json();
    },
    staleTime: Infinity,
  };
}

export { allBooksQuery };
