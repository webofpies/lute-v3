import { Box, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

function SoftwareInfo() {
  const { isPending, isFetching, error, data, isSuccess } = useQuery({
    queryKey: ["version"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/api/appinfo`);
      return await response.json();
    },
    staleTime: Infinity,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <Text component="p" size="md">
        <b>LUTE</b>: Learning Using Texts v3
      </Text>

      <Box pos="relative" h="100%" mt="md">
        <LoadingOverlay visible={isPending || isFetching} zIndex={1000} />

        {isSuccess && (
          <>
            <Text component="p" size="md">
              <b>Version</b>: {data.version}
            </Text>
            <Text component="p" size="md">
              <b>Data path</b>: {data.datapath}
            </Text>
            <Text component="p" size="md">
              <b>Database</b>: {data.database}
            </Text>
            {data.isDocker && (
              <Text component="p">
                <em>
                  Note these are paths in your container, not on the host. You
                  mounted host paths when you started the container.
                </em>
              </Text>
            )}
          </>
        )}
      </Box>

      <Stack mt="md" gap={0}>
        <Text component="p">
          <b>Repository</b>:{" "}
          <a href="https://github.com/LuteOrg/lute-v3">lute-v3</a>
        </Text>
        <Text component="p">Lute is released under the MIT License.</Text>
      </Stack>
    </>
  );
}

export default SoftwareInfo;
