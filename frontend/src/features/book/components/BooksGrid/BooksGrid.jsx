import { keepPreviousData, useQuery } from "@tanstack/react-query";
import BookCard from "../BookCard/BookCard";
import { SimpleGrid } from "@mantine/core";

const fetchURL = new URL("/api/books", "http://localhost:5001");

function BooksGrid() {
  const { data } = useQuery({
    queryKey: ["allBooks", fetchURL.href],
    queryFn: async () => {
      const response = await fetch(fetchURL.href);
      return await response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  return (
    data && (
      <SimpleGrid cols={3}>
        {data.data.map((book) => (
          <BookCard key={book.title} book={book} />
        ))}
      </SimpleGrid>
    )
  );
}

export default BooksGrid;
