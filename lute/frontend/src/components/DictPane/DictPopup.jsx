import { useEffect } from "react";

function DictPopup({ url, newTab }) {
  useEffect(() => {
    let settings =
      "width=800, height=600, scrollbars=yes, menubar=no, resizable=yes, status=no";
    if (newTab) settings = null;
    window.open(url, "otherwin", settings);
  });

  return <></>;
}

export default DictPopup;
