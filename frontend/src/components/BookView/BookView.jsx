import { lazy, Suspense, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Group, Loader } from "@mantine/core";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReadPane from "../ReadPane/ReadPane";
import TranslationPane from "../TranslationPane/TranslationPane";
import { bookQuery, pageQuery } from "../../queries/book";
import { definedLangInfoQuery } from "../../queries/language";
import { termDataQuery } from "../../queries/term";
import { useInitialize } from "../../hooks/book";
import { paneResizeStorage } from "../../misc/utils";
import classes from "./BookView.module.css";
import BulkTermForm from "../BulkTermForm/BulkTermForm";

const ThemeForm = lazy(() => import("../ThemeForm/ThemeForm"));

function BookView({ themeFormOpen, onThemeFormOpen, onDrawerOpen }) {
  const { id, page: pageNum } = useParams();
  const [params] = useSearchParams();
  const editMode = params.get("edit") === "true";

  const [activeTerm, setActiveTerm] = useState({ data: null, type: "single" });
  const [activeTab, setActiveTab] = useState("0");

  const key =
    activeTerm &&
    activeTerm.type !== "shift" &&
    (activeTerm.type === "multi"
      ? `${activeTerm.data}/${activeTerm.langID}`
      : activeTerm.data);

  const { data: book } = useQuery(bookQuery(id));
  const { data: page } = useQuery(pageQuery(id, pageNum));
  const { data: language } = useQuery(definedLangInfoQuery(book.languageId));
  const { data: term } = useQuery(termDataQuery(key));

  const [state, dispatch] = useInitialize(
    book,
    language,
    setActiveTerm,
    onThemeFormOpen
  );

  const showTranslationPane =
    activeTerm.data && activeTerm.type !== "shift" && term && !themeFormOpen;
  const showBulkTermForm = activeTerm.type === "shift";
  const showThemeForm = themeFormOpen && !editMode;

  const paneRightRef = useRef(null);

  return (
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
          activeTerm={activeTerm}
          onSetActiveTerm={setActiveTerm}
          onDrawerOpen={onDrawerOpen}
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
            {showTranslationPane && (
              <TranslationPane
                term={term}
                language={language}
                activeTab={activeTab}
                onSetActiveTab={setActiveTab}
                onSetActiveTerm={setActiveTerm}
              />
            )}
            {showBulkTermForm && <BulkTermForm termIds={activeTerm.data} />}
            {showThemeForm && (
              <Group justify="center" align="center" h="100%" p={10}>
                <Suspense fallback={<Loader />}>
                  <ThemeForm onClose={() => onThemeFormOpen(false)} />
                </Suspense>
              </Group>
            )}
          </Panel>
        </>
      )}
    </PanelGroup>
  );
}

export default BookView;
