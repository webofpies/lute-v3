import { useQuery } from "@tanstack/react-query";
import DataTablePaginated from "../DataTable/DataTablePaginated";
import PageSpinner from "../PageSpinner/PageSpinner";

const NUM_OF_ITEMS_PER_PAGE = 8;

export default function BookTable() {
  const { isPending, isFetching, error, data } = useQuery({
    queryKey: ["allBooks"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/api/books`);
      return await response.json();
    },
    staleTime: Infinity,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {isFetching || isPending ? (
        <PageSpinner />
      ) : (
        <>
          <DataTablePaginated data={data} numItems={NUM_OF_ITEMS_PER_PAGE} />
        </>
      )}
    </>
  );
}
