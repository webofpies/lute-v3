import { Image } from "@mantine/core";

function DictFavicon({ hostname }) {
  return (
    <Image
      h={16}
      w={16}
      src={`http://www.google.com/s2/favicons?domain=${hostname}`}
    />
  );
}

export default DictFavicon;
