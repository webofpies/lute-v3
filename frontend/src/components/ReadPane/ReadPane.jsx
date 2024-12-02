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

function ReadPane({
  book,
  page,
  refs,
  state,
  dispatch,
  onSetActiveTerm,
  onDrawerOpen,
}) {
  const { page: pageNum } = useParams();
  const [params, setParams] = useSearchParams();

  const editMode = params.get("edit") === "true";

  function handleActivateEdit() {
    onSetActiveTerm({ data: null });
    setParams({ edit: "true" });
  }

  return (
    <>
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
        ref={refs.contextMenuArea}
        flex={1}
        onMouseDown={(e) => {
          const res = handleClickOutside(e);
          if (!res) return;
          onSetActiveTerm(res);
        }}>
        <div
          dir={book.isRightToLeft ? "rtl" : "ltr"}
          className={`${classes.textContainer}`}
          style={{
            width: `${state.focusMode ? 50 : 100}%`,
            marginInline: state.focusMode && "auto",
          }}>
          {editMode ? (
            <EditTheText
              dir={book.isRightToLeft ? "rtl" : "ltr"}
              text={page.text}
              fontSize={state.fontSize}
            />
          ) : (
            <>
              {Number(pageNum) === 1 && (
                <Title className={classes.title}>{book.title}</Title>
              )}
              <TheText
                paragraphs={page.paragraphs}
                onSetActiveTerm={onSetActiveTerm}
                refs={refs}
              />
            </>
          )}
        </div>
      </ScrollArea>
    </>
  );
}

export default ReadPane;
