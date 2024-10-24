import { memo } from "react";

function DictIFrame({ src }) {
  // lazy loading makes sure dict loads only on tab open. if not set all dicts load at the same time
  return (
    <iframe style={{ border: "none" }} width="100%" height="100%" src={src} loading="lazy"></iframe>
  );
}

export default memo(DictIFrame);
