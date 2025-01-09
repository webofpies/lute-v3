import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button, Group, Text } from "@mantine/core";
import PageTitle from "../components/PageTitle/PageTitle";
import BackupsTable from "../components/BackupsTable/BackupsTable";
import PageContainer from "../components/PageContainer/PageContainer";
import { backupsQuery } from "../queries/backup";

function Backups() {
  const { data } = useQuery(backupsQuery);
  const backups = data.backups.map((backup) => ({
    ...backup,
    url: `/backup/download/${backup.name}`,
  }));

  return (
    <PageContainer width="75%">
      <PageTitle>Backups</PageTitle>
      <Group justify="space-between">
        <Text component="p" size="sm">{`Stored in: ${data.directory}`}</Text>
        <Button
          component={Link}
          to="http://localhost:5001/backup/backup?type=manual">
          Create New
        </Button>
      </Group>
      <BackupsTable data={backups} />
    </PageContainer>
  );
}

export default Backups;
