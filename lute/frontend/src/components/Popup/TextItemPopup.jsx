// import { useState } from "react";
import TextItem from "../TheText/TextItem";
import Popup from "./Popup";

function TextItemPopup(props) {
  const { data, highlightsOn, ...restProps } = props;

  return data.hasPopup ? (
    <Popup key={data.id} id={data.wid}>
      <TextItem {...restProps} data={data} highlightsOn={highlightsOn} />
    </Popup>
  ) : (
    <TextItem {...restProps} data={data} highlightsOn={highlightsOn} />
  );
}

export default TextItemPopup;
