import { Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { softwareInfoQuery } from "@settings/api/settings";

function SoftwareInfo() {
  const { data } = useQuery(softwareInfoQuery);
  return (
    <>
      <Text component="p" size="md">
        <b>LUTE</b>: Learning Using Texts v3
      </Text>

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
            Note these are paths in your container, not on the host. You mounted
            host paths when you started the container.
          </em>
        </Text>
      )}

      <Stack mt="md" gap={0}>
        <Text component="p">
          <b>Repository</b>:{" "}
          <a href="https://github.com/LuteOrg/lute-v3" target="_blank">
            lute-v3
          </a>
        </Text>
        <Text component="p">Lute is released under the MIT License.</Text>
      </Stack>
    </>
  );
}

export default SoftwareInfo;
