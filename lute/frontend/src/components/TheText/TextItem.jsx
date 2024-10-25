// lute\templates\read\textitem.html
import { forwardRef, memo } from "react";

const TextItem = forwardRef(function TextItem(props, ref) {
  const { highlightsOn, ...restProps } = props;

  return (
    <span
      ref={ref}
      {...restProps}
      style={{
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      id={props.data.id}
      className={`${props.data.classes} ${
        highlightsOn & props.data.isWord ? props.data.statusClass : ""
      }`}
      data-lang-id={props.data.langId}
      data-paragraph-id={props.data.paragraphId}
      data-sentence-id={props.data.sentenceId}
      data-text={props.data.text}
      data-status-class={props.data.statusClass}
      data-order={props.data.order}
      data-wid={props.data.wid || null}>
      {props.data.displayText.replace(/&nbsp;/g, " ")}
    </span>
  );
});

export default memo(TextItem);
