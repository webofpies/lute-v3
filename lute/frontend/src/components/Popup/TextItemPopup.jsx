import TextItem from "../TheText/TextItem";
import Popup from "./Popup";

function TextItemPopup(props) {
  const { data, ...restProps } = props;

  return data.isWord ? (
    <Popup id={data.wid}>
      <TextItem {...restProps} data={data} />
    </Popup>
  ) : (
    // non-word spans
    <TextItem data={data} />
  );
}

export default TextItemPopup;
