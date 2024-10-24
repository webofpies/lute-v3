// import { useState } from "react";
import TextItem from "../TheText/TextItem";
import Popup from "./Popup";

function TextItemPopup(props) {
  // const [show, setShow] = useState(false);

  const {
    textitem,
    highlightsOn,
    // selectedTermID,
    // onSetSelectedTermID,
    ...restProps
  } = props;

  return textitem.class.includes("showtooltip") ? (
    <Popup
      key={textitem.id}
      id={textitem["data-wid"]}
      // show={textitem.class.includes("showtooltip")}
    >
      <TextItem {...restProps} data={textitem} highlightsOn={highlightsOn} />
    </Popup>
  ) : (
    <TextItem
      {...restProps}
      // onMouseOver={(e) => {
      //   // onMouseOver(e);
      //   setShow(true);
      // }}
      data={textitem}
      highlightsOn={highlightsOn}
    />
  );
}

export default TextItemPopup;
