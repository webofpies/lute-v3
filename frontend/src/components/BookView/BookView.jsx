import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReadPane from "../ReadPane/ReadPane";
import TranslationPane from "../TranslationPane/TranslationPane";
import DrawerMenu from "../DrawerMenu/DrawerMenu";
import ThemeForm from "../ThemeForm/ThemeForm";
import { useInitialize } from "../../hooks/book";
import { bookQuery, pageQuery } from "../../queries/book";
import { paneResizeStorage } from "../../misc/utils";
import { languageInfoQuery } from "../../queries/language";
import { termDataQuery } from "../../queries/term";
import classes from "./BookView.module.css";

function BookView() {
  const { id, page: pageNum } = useParams();
  const [params] = useSearchParams();
  const editMode = params.get("edit") === "true";
  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });

  const key =
    activeTerm && activeTerm.type === "multi"
      ? `${activeTerm.data}/${activeTerm.langID}`
      : activeTerm.data;

  const { data: book } = useQuery(bookQuery(id));
  const { data: page } = useQuery(pageQuery(id, pageNum));
  const { data: language } = useQuery(languageInfoQuery(book.languageId));
  const { data: term } = useQuery(termDataQuery(key));

  const [openThemeForm, setOpenThemeForm] = useState(false);
  const [state, dispatch] = useInitialize(
    book,
    language,
    setActiveTerm,
    setOpenThemeForm
  );

  const paneRightRef = useRef(null);
  const [drawerOpened, { open: drawerOpen, close: drawerClose }] =
    useDisclosure(false);

  return (
    <>
      <DrawerMenu
        opened={drawerOpened}
        close={drawerClose}
        onOpenThemeForm={setOpenThemeForm}
      />

      <PanelGroup
        className="readpage"
        autoSaveId="Lute.horizontalSize"
        direction="horizontal"
        storage={paneResizeStorage}>
        <Panel
          order={1}
          defaultSize={50}
          minSize={30}
          className={classes.paneLeft}>
          <ReadPane
            book={book}
            page={page}
            isRtl={language.isRightToLeft}
            state={state}
            dispatch={dispatch}
            onSetActiveTerm={setActiveTerm}
            onDrawerOpen={drawerOpen}
          />
        </Panel>

        {!state.focusMode && (
          <>
            <PanelResizeHandle
              hitAreaMargins={{ coarse: 10, fine: 10 }}
              className={classes.resizeHandle}
              onDoubleClick={() => {
                const panel = paneRightRef.current;
                if (panel)
                  panel.getSize() < 15 ? panel.resize(50) : panel.resize(5);
              }}
            />

            <Panel
              ref={paneRightRef}
              defaultSize={50}
              order={2}
              collapsible={true}
              minSize={5}>
              {term && !openThemeForm && (
                <TranslationPane
                  term={term}
                  language={language}
                  onSetActiveTerm={setActiveTerm}
                />
              )}
              {openThemeForm && !editMode && (
                <Group justify="center" align="center" h="100%" p={10}>
                  <ThemeForm />
                </Group>
              )}
            </Panel>
          </>
        )}
      </PanelGroup>
    </>
  );
}

export default BookView;
