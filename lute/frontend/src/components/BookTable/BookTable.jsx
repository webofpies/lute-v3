import { Center, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import DataTablePaginated from "../DataTable/DataTablePaginated";

const NUM_OF_ITEMS_PER_PAGE = 8;

export default function BookTable() {
  const { isPending, isFetching, error, data } = useQuery({
    queryKey: ["allBooks"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/book/books`);
      return await response.json();
    },
    staleTime: Infinity,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {isFetching || isPending ? (
        <Center>
          <Loader size="xl" />
        </Center>
      ) : (
        <>
          <DataTablePaginated data={data} numItems={NUM_OF_ITEMS_PER_PAGE} />
        </>
      )}
    </>
  );
}
