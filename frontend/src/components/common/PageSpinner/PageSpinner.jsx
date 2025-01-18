import { Group, Loader } from "@mantine/core";

function PageSpinner() {
  return (
    <Group justify="center" align="center" pos="relative" h="100%">
      <Loader />
    </Group>
  );
}

export default PageSpinner;
