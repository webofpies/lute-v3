import TextItem from "../TheText/TextItem";
import Popup from "./Popup";

function TextItemPopup(props) {
  const { data, highlightsOn, ...restProps } = props;

  return data.isWord ? (
    data.hasPopup ? (
      <Popup id={data.wid}>
        <TextItem {...restProps} data={data} highlightsOn={highlightsOn} />
      </Popup>
    ) : (
      <TextItem {...restProps} data={data} highlightsOn={highlightsOn} />
    )
  ) : (
    // non-word spans
    <TextItem data={data} highlightsOn={highlightsOn} />
  );
}

export default TextItemPopup;
