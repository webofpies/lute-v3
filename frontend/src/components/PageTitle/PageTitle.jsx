import { Divider, Text } from "@mantine/core";

function PageTitle({ children }) {
  return (
    <>
      <Text component="h2" fz={26} lh={1} fw={600} mb={5} ta="center">
        {children}
      </Text>
      <Divider mb={15} />
    </>
  );
}

export default PageTitle;
