import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Center, Divider, Loader, Title } from "@mantine/core";
import { useDisclosure, useMouse } from "@mantine/hooks";
import ReadPaneHeader from "./ReadPaneHeader";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import LearnPane from "./LearnPane";
import Player from "../Player/Player";
import TheText from "../TheText/TheText";
import styles from "./ReadPane.module.css";
import { clamp } from "../../utils";

export default function ReadPane() {
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const [highlightsOn, setHighlightsOn] = useState(true);
  const [activeTerm, setActiveTerm] = useState({ data: null, multi: false });
  const [width, setWidth] = useState(50);
  const paneLeftRef = useRef();
  const paneRightRef = useRef();

  const { ref, x } = useMouse();

  function handleResize(e) {
    e.preventDefault();
    paneLeftRef.current.style.pointerEvents = "none";
    paneRightRef.current.style.pointerEvents = "none";

    const containerHeight = parseFloat(
      window.getComputedStyle(ref.current).getPropertyValue("width")
    );

    function resize(e) {
      const delta = x - e.clientX;
      const ratioInPct = (delta / containerHeight) * 100;
      const newWidth = width - ratioInPct;
      setWidth(clamp(newWidth, 5, 95));
    }

    ref.current.addEventListener("mousemove", resize);

    ref.current.addEventListener("mouseup", () => {
      ref.current.removeEventListener("mousemove", resize);
      paneLeftRef.current.style.pointerEvents = "unset";
      paneRightRef.current.style.pointerEvents = "unset";
    });
  }

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

      <div ref={ref}>
        <div
          ref={paneLeftRef}
          className={styles.paneLeft}
          style={{ width: `${width}%` }}>
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
                width={width}
              />
              <div style={{ marginTop: "8rem" }}>
                {book.audio_filename && <Player book={book} />}
                {currentPage === 1 && (
                  <Title
                    style={{ overflowWrap: "break-word" }}
                    size="xl"
                    mb="lg"
                    dir={book.is_rtl ? "rtl" : ""}>
                    {book.title}
                  </Title>
                )}
                <TheText
                  book={book}
                  page={currentPage}
                  highlightsOn={highlightsOn}
                  onSetActiveTerm={setActiveTerm}
                />
              </div>
            </>
          )}
        </div>

        <Divider
          style={{ left: `${width}%` }}
          styles={{ root: { width: "6px", border: "none" } }}
          className={styles.vdivider}
          orientation="vertical"
          onMouseDown={handleResize}
        />

        <div
          ref={paneRightRef}
          className={styles.paneRight}
          style={{ width: `${100 - width}%` }}>
          {activeTerm.data && <LearnPane book={book} termData={activeTerm} />}
        </div>
      </div>
    </>
  );
}
