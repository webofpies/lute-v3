import { Center, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import HeaderMenuBar from "../HeaderMenu/HeaderMenuBar";
import DataTablePaginated from "../DataTable/DataTablePaginated";
import AboutModal from "../About/AboutModal";
import { useDisclosure } from "@mantine/hooks";

const NUM_OF_ITEMS_PER_PAGE = 8;

export default function Homepage() {
  const [opened, { open, close }] = useDisclosure(false);

  const { isPending, isFetching, error, data } = useQuery({
    queryKey: ["allBooks"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/book/books`);
      return await response.json();
    },
    staleTime: Infinity,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <HeaderMenuBar openVersionModal={open} />
      <AboutModal opened={opened} close={close} />
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
