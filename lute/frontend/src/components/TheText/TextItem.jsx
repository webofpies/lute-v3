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
      className={`${props.data.class} ${
        highlightsOn & props.data.class.includes("word")
          ? props.data["data-status-class"]
          : ""
      }`}
      data-lang-id={props.data["data-lang-id"]}
      data-paragraph-id={props.data["data-paragraph-id"]}
      data-sentence-id={props.data["data-sentence-id"]}
      data-text={props.data["data-text"]}
      data-status-class={props.data["data-status-class"]}
      data-order={props.data["data-order"]}
      data-wid={props.data["data-wid"] || null}>
      {props.data.html_display_text.replace(/&nbsp;/g, " ")}
    </span>
  );
});

export default memo(TextItem);
