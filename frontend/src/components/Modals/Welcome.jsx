import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ActionIcon, Box, Button, Group, Select } from "@mantine/core";
import { IconBook2, IconCheck, IconSelector } from "@tabler/icons-react";
import {
  loadSampleStoriesQuery,
  predefinedListQuery,
} from "../../queries/language";

function Welcome() {
  const queryClient = useQueryClient();
  const { data: predefined } = useQuery(predefinedListQuery);
  const [language, setLanguage] = useState(null);

  async function handleLoadSampleStories() {
    try {
      await queryClient.fetchQuery(loadSampleStoriesQuery(language));
      queryClient.refetchQueries({ queryKey: ["allBooks"] });
      queryClient.refetchQueries({ queryKey: ["initialQuery"] });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Box p={5}>
      <Group wrap="nowrap" mb={10} justify="space-between">
        <span>
          To get started using <strong>Lute</strong> load a short story in
        </span>{" "}
        <Select
          w={200}
          autoFocus={false}
          display="inline-block"
          data={predefined || []}
          placeholder="Predefined language"
          allowDeselect={false}
          withCheckIcon={false}
          searchable={true}
          onChange={setLanguage}
          rightSection={
            language ? (
              <ActionIcon
                size="md"
                variant="light"
                onClick={handleLoadSampleStories}>
                <IconCheck />
              </ActionIcon>
            ) : (
              <IconSelector size={16} />
            )
          }
          rightSectionPointerEvents={language === null ? "none" : "all"}
        />
      </Group>

      <Group wrap="nowrap" justify="center">
        <span>or</span>
        <Button component={Link} leftSection={<IconBook2 />} to="/books/new">
          Create a New Book
        </Button>
      </Group>
    </Box>
  );
}

export default Welcome;
