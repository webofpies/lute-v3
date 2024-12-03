import { useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ScrollArea, Title } from "@mantine/core";
import ReadHeader from "../ReadHeader/ReadHeader";
import Player from "../Player/Player";
import Toolbar from "../Toolbar/Toolbar";
import TheText from "../TheText/TheText";
import classes from "../BookView/BookView.module.css";
import { handleClickOutside } from "../../lute";
import EditTheText from "../EditTheText/EditTheText";
import EditHeader from "../EditHeader/EditHeader";
import ContextMenu from "../ContextMenu/ContextMenu";

function ReadPane({
  book,
  page,
  state,
  dispatch,
  onSetActiveTerm,
  onDrawerOpen,
}) {
  const { page: pageNum } = useParams();
  const [params, setParams] = useSearchParams();
  const contextMenuAreaRef = useRef(null);

  const editMode = params.get("edit") === "true";

  function handleActivateEdit() {
    onSetActiveTerm({ data: null });
    setParams({ edit: "true" });
  }

  return (
    <>
      {!editMode && <ContextMenu forwardedRef={contextMenuAreaRef} />}
      <div style={{ position: "relative" }}>
        {editMode ? (
          <EditHeader book={book} page={pageNum} onSetEdit={setParams} />
        ) : (
          <>
            <ReadHeader
              book={book}
              drawerOpen={onDrawerOpen}
              state={state}
              dispatch={dispatch}
              onActivateEdit={handleActivateEdit}
            />
            {book.audio && <Player book={book} />}
            <Toolbar state={state} dispatch={dispatch} />
          </>
        )}
      </div>
      <ScrollArea
        type="scroll"
        ref={contextMenuAreaRef}
        flex={1}
        onMouseDown={(e) => {
          const res = handleClickOutside(e);
          if (!res) return;
          onSetActiveTerm(res);
        }}>
        <div
          dir={book.isRightToLeft ? "rtl" : "ltr"}
          className={`${classes.textContainer} `}
          style={{
            fontSize: `${state.fontSize}rem`,
            width: `${state.focusMode ? 50 : 100}%`,
            marginInline: state.focusMode && "auto",
          }}>
          {editMode ? (
            <EditTheText text={page.text} />
          ) : (
            <>
              {Number(pageNum) === 1 && (
                <Title className={classes.title}>{book.title}</Title>
              )}
              <div
                style={{ columnCount: state.columnCount }}
                className={`thetext ${state.highlights && "highlight"}`}>
                <TheText
                  paragraphs={page.paragraphs}
                  onSetActiveTerm={onSetActiveTerm}
                />
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </>
  );
}

export default ReadPane;
