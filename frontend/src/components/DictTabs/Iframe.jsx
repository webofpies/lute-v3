import { memo } from "react";

function Iframe({ src, onHandleFocus }) {
  // lazy loading makes sure dict loads only on tab open. if not set all dicts load at the same time
  return (
    <iframe
      onLoad={onHandleFocus}
      style={{ border: "none" }}
      width="100%"
      height="100%"
      src={src}
      loading="lazy"></iframe>
  );
}

export default memo(Iframe);
