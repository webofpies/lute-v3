// lute\templates\read\textitem.html
import { forwardRef, memo } from "react";
import classes from "./TheText.module.css";

const TextItem = forwardRef(function TextItem(props, ref) {
  const { data, ...restProps } = props;

  return (
    <span
      ref={ref}
      {...restProps}
      id={data.id}
      className={`${data.classes} ${classes.textitem} ${data.isWord ? data.statusClass : ""}`}
      data-lang-id={data.langId}
      data-paragraph-id={data.paragraphId}
      data-sentence-id={data.sentenceId}
      data-text={data.text}
      data-status-class={data.statusClass}
      data-order={data.order}
      data-wid={data.wid || null}>
      {data.displayText.replace(/&nbsp;/g, " ")}
    </span>
  );
});

export default memo(TextItem);
