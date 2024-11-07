// lute\templates\read\textitem.html
import { forwardRef, memo, useContext } from "react";
import { UserSettingsContext } from "../../context/UserSettingsContext";

const TextItem = forwardRef(function TextItem(props, ref) {
  const { data, ...restProps } = props;
  const { settings } = useContext(UserSettingsContext);

  return (
    <span
      ref={ref}
      {...restProps}
      style={{
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      id={data.id}
      className={`${data.classes} ${
        settings.showHighlights & data.isWord ? data.statusClass : ""
      }`}
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
