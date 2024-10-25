import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ReadPaneHeader from "./ReadPaneHeader";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import LearnPane from "./LearnPane";
import Player from "../Player/Player";
import TheText from "../TheText/TheText";
import styles from "./ReadPane.module.css";

export default function ReadPane() {
  const [currentPage, setCurrentPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const [highlightsOn, setHighlightsOn] = useState(true);
  const [activeTerm, setActiveTerm] = useState({ data: null, multi: false });

  const { id } = useParams();

  const {
    isSuccess,
    isPending,
    error,
    data: book,
  } = useQuery({
    queryKey: ["bookData", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/read/${id}/info`);
      return await response.json();
    },
  });

  useEffect(() => {
    const title = document.title;
    if (isSuccess) document.title = `Reading "${book.title}"`;

    return () => {
      document.title = title;
    };
  }, [book, isSuccess]);

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <DrawerMenu
        opened={opened}
        close={close}
        onToggleHighlights={() => {
          setHighlightsOn((h) => !h);
        }}
      />

      <div>
        <div className={styles.paneLeft}>
          {isPending ? (
            <Center>
              <Loader color="blue" />
            </Center>
          ) : (
            <>
              <ReadPaneHeader
                open={open}
                currentPage={currentPage}
                book={book}
                setCurrentPage={setCurrentPage}
              />
              {book.audio_filename && <Player book={book} />}
              <TheText
                book={book}
                page={currentPage}
                highlightsOn={highlightsOn}
                onSetActiveTerm={setActiveTerm}
              />
            </>
          )}
        </div>

        {activeTerm.data && <LearnPane book={book} termData={activeTerm} />}
      </div>
    </>
  );
}
