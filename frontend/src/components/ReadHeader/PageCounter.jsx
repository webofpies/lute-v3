import { rem, Text } from "@mantine/core";

function PageCounter({ currentPage, pageCount }) {
  return (
    <Text
      component="span"
      fw={500}
      fz="inherit"
      lh={1}
      ml="auto"
      miw={rem(24)}
      style={{ flexShrink: 0 }}>
      {`${currentPage}/${pageCount}`}
    </Text>
  );
}

export default PageCounter;
