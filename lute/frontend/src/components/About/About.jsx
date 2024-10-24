import { Box, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

function About() {
  const { isPending, isFetching, error, data, isSuccess } = useQuery({
    queryKey: ["version"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/appinfo`);
      return await response.json();
    },
    staleTime: Infinity,
  });

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <Text component="p" size="lg">
        LUTE: Learning Using Texts v3
      </Text>

      <Box pos="relative" h="100%" mt="md">
        <LoadingOverlay visible={isPending || isFetching} zIndex={1000} />

        {isSuccess && (
          <>
            <Text component="p" size="md">
              Version: {data.version}
            </Text>
            <Text component="p" size="md">
              Data path: {data.datapath}
            </Text>
            <Text component="p" size="md">
              Database: {data.database}
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
          Repository: <a href="https://github.com/jzohrab/lute-v3">lute-v3</a>
        </Text>
        <Text component="p">Lute is released under the MIT License.</Text>
      </Stack>
    </>
  );
}

export default About;
