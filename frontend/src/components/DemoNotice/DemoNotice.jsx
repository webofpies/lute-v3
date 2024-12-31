import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, Button, rem, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconInfoCircle } from "@tabler/icons-react";
import { databaseCleaned, demoDeactivated } from "../../misc/notifications";
import { wipeDemoDBQuery, deactivateDemoQuery } from "../../queries/settings";

function DemoNotice({ tutorialBookId }) {
  const queryClient = useQueryClient();

  async function handleWipeDemoDb() {
    try {
      await queryClient.fetchQuery(wipeDemoDBQuery);

      notifications.show(databaseCleaned);
      queryClient.invalidateQueries({ queryKey: ["allBooks"] });
      queryClient.invalidateQueries({ queryKey: ["initialQuery"] });
    } catch (err) {
      console.error("Failed to wipe database:", err);
    }
  }

  async function handleDismiss() {
    try {
      await queryClient.fetchQuery(deactivateDemoQuery);

      queryClient.invalidateQueries({ queryKey: ["initialQuery"] });
      notifications.show(demoDeactivated);
    } catch (err) {
      console.error("Failed to deactivate demo mode:", err);
    }
  }

  return (
    <Alert
      styles={{ wrapper: { alignItems: "center" }, body: { gap: rem(5) } }}
      variant="light"
      color="green"
      title="Demo material"
      icon={<IconInfoCircle />}>
      <Text size="sm">
        The Lute database has been loaded with a{" "}
        <Link to={`/books/${tutorialBookId}/pages/1`}>brief tutorial</Link>,
        some languages and short texts for you to try out. When you&apos;re done
        trying out the demo,{" "}
        <Button
          p={0}
          styles={{ root: { verticalAlign: "unset" } }}
          onClick={handleWipeDemoDb}
          size="compact-sm"
          variant="transparent"
          fw="normal">
          clear out the database
        </Button>{" "}
        <em>(this removes everything in the db)</em>. Or instead,{" "}
        <Button
          p={0}
          styles={{ root: { verticalAlign: "unset" } }}
          onClick={handleDismiss}
          size="compact-sm"
          variant="transparent"
          fw="normal">
          dismiss this message.
        </Button>
      </Text>
    </Alert>
  );
}

export default DemoNotice;
