import { useQuery } from "@tanstack/react-query";
import DictPane from "../DictPane/DictPane";
import TermForm from "../TermForm/TermForm";
import styles from "./ReadPane.module.css";
import { LoadingOverlay } from "@mantine/core";

function LearnPane({ book, termData }) {
  const { isFetching, isSuccess, data, error } = useFetchTerm(termData);

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className={styles.paneRight}>
      <LoadingOverlay
        visible={isFetching}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {isSuccess && (
        <>
          <TermForm termData={data} />
          <DictPane term={data.text} dicts={book.term_dicts} />
        </>
      )}
    </div>
  );
}

function useFetchTerm(termData) {
  const key = termData.multi
    ? `${termData.langID}/${termData.data}`
    : termData.data;

  return useQuery({
    queryKey: ["termData", key],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/read/terms/${key}`);
      return await response.json();
    },
    refetchOnWindowFocus: false,
    // enabled: !termData.multi && !!termData.data,
    // staleTime: Infinity, // relicking the same work opens an empty form
  });
}

export default LearnPane;
