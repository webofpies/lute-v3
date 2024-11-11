import { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useParams } from "react-router-dom";
import { Divider, Title } from "@mantine/core";
import { useDisclosure, useMouse } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import LearnPane from "./LearnPane";
import ReadPaneHeader from "./ReadPaneHeader";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import Toolbar from "../Toolbar/Toolbar";
import ContextMenu from "../ContextMenu/ContextMenu";
import Player from "../Player/Player";
import TheText from "../TheText/TheText";
import styles from "./ReadPane.module.css";
import { UserSettingsContext } from "../../context/UserSettingsContext";
import { actions } from "../../misc/actionsMap";
import {
  setupKeydownEvents,
  handleResizeHorizontal,
} from "../../misc/textActions";

function ReadPane() {
  const { id, page: pageNum } = useParams();
  const { settings } = useContext(UserSettingsContext);

  const { ref, x } = useMouse();
  const paneLeftRef = useRef();
  const paneRightRef = useRef();
  const dividerRef = useRef();
  const textContainerRef = useRef();

  const [opened, { open, close }] = useDisclosure(false);
  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });
  const [width, setWidth] = useState(50);

  const { data: book } = useQuery(bookQuery(id));
  const { data: page } = useQuery(pageQuery(id, pageNum));

  useInitialize(book, settings);

  return (
    <>
      <DrawerMenu opened={opened} close={close} />
      <Toolbar />
      <ContextMenu ref={textContainerRef} />

      <div ref={ref}>
        <div
          ref={paneLeftRef}
          className={styles.paneLeft}
          style={{ width: `${width}%` }}>
          <div style={{ width: `${width}%`, position: "fixed", zIndex: 4 }}>
            <ReadPaneHeader book={book} open={open} pageNum={Number(pageNum)} />
            {book.audio.name && <Player book={book} />}
          </div>
          <div
            ref={textContainerRef}
            className={styles.textContainer}
            style={{ paddingTop: `${book.audio.name ? "9.5rem" : "7.5rem"}` }}>
            {Number(pageNum) === 1 && (
              <Title
                style={{ overflowWrap: "break-word" }}
                size="xl"
                mb="lg"
                dir={book.isRightToLeft ? "rtl" : ""}>
                {book.title}
              </Title>
            )}
            <TheText pageData={page} onSetActiveTerm={setActiveTerm} />
          </div>
        </div>

        <Divider
          ref={dividerRef}
          style={{ left: `${width}%` }}
          styles={{ root: { width: "8px", border: "none" } }}
          className={styles.vdivider}
          orientation="vertical"
          onMouseDown={(e) =>
            handleResizeHorizontal(
              e,
              width,
              setWidth,
              ref.current,
              paneLeftRef.current,
              paneRightRef.current,
              dividerRef.current,
              x
            )
          }
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

export function loader(queryClient) {
  return async ({ params }) => {
    const bq = bookQuery(params.id);

    const bookData =
      queryClient.getQueryData(bq.queryKey) ??
      (await queryClient.fetchQuery(bq));

    const pq = pageQuery(params.id, params.page);

    const pageData =
      queryClient.getQueryData(pq.queryKey) ??
      (await queryClient.fetchQuery(pq));

    return { bookData, pageData };
  };
}

function bookQuery(id) {
  return {
    queryKey: ["bookData", id],
    queryFn: async () => {
      const bookResponse = await fetch(`http://localhost:5001/read/${id}/info`);
      const book = await bookResponse.json();
      return book;
    },
    refetchOnWindowFocus: false,
  };
}

function pageQuery(bookId, pageNum) {
  return {
    queryKey: ["pageData", bookId, pageNum],
    queryFn: async () => {
      const pageResponse = await fetch(
        `http://localhost:5001/read/${bookId}/${pageNum}/pageinfo`
      );
      const pageData = await pageResponse.json();
      return pageData;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  };
}

function useInitialize(book, settings) {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  });

  useEffect(() => {
    const title = document.title;
    document.title = `Reading "${book.title}"`;

    return () => {
      document.title = title;
    };
  }, [book.title]);

  useEffect(() => {
    function handleKeydown(e) {
      setupKeydownEvents(e, actions, {
        ...settings,
        rtl: book.isRightToLeft,
        bookId: book.id,
        pageNum: book.currentPage,
        sentenceDicts: book.dictionaries.sentence,
      });
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [
    book.currentPage,
    book.dictionaries.sentence,
    book.id,
    book.isRightToLeft,
    settings,
  ]);
}

export default ReadPane;
