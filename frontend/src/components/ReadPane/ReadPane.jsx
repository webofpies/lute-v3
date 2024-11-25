import { useParams } from "react-router-dom";
import { ScrollArea, Title } from "@mantine/core";
import ReadHeader from "../ReadHeader/ReadHeader";
import Player from "../Player/Player";
import Toolbar from "../Toolbar/Toolbar";
import TheText from "../TheText/TheText";
import classes from "./ReadPane.module.css";
import { handleClickOutside } from "../../lute";

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
  return (
    <>
      <div style={{ position: "relative" }}>
        <ReadHeader
          book={book}
          drawerOpen={onDrawerOpen}
          state={state}
          dispatch={dispatch}
        />
        {book.audio.name && <Player book={book} />}
        <Toolbar state={state} dispatch={dispatch} />
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
          {Number(pageNum) === 1 && (
            <Title className={classes.title}>{book.title}</Title>
          )}
          <TheText
            pageData={page}
            onSetActiveTerm={onSetActiveTerm}
            refs={refs}
          />
        </div>
      </ScrollArea>
    </>
  );
}

export default ReadPane;
