import { Image, Text } from "@mantine/core";

function TranslationCell({ row }) {
  const img = row.original.image;
  return (
    <>
      <Text size="sm" component="span">
        {row.original.translation}
      </Text>
      {img && <Image src={`http://localhost:5001${img}`} h={150} w="auto" />}
    </>
  );
}

export default TranslationCell;
