import { Alert, rem, Text } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function DemoNotice({ onSetClosed, tutBookId = 1 }) {
  return (
    <Alert
      onClose={() => onSetClosed(true)}
      styles={{ wrapper: { alignItems: "center" }, body: { gap: rem(5) } }}
      variant="light"
      color="green"
      withCloseButton
      title="Demo material"
      icon={<IconInfoCircle />}>
      <Text size="xs">
        The Lute database has been loaded with a{" "}
        <Link to={`/books/${tutBookId}/pages/1`}>brief tutorial</Link>, some
        languages and short texts for you to try out. When you&apos;re done
        trying out the demo, <Link to="/wipe_database">click here</Link> to
        clear out the database{" "}
        <em>(Note: this removes everything in the db)</em>. Or instead, dismiss
        this message.
      </Text>
    </Alert>
  );
}

export default DemoNotice;
