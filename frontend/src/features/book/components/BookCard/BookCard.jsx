import { Link } from "react-router-dom";
import { DonutChart } from "@mantine/charts";
import { IconArchiveFilled, IconCircleCheckFilled } from "@tabler/icons-react";
import {
  Card,
  Group,
  Pill,
  PillGroup,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import classes from "./BookCard.module.css";

function BookCard({ book }) {
  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <div>
          <Group gap={5} wrap="nowrap" align="flex-start">
            <ThemeIcon
              size="sm"
              color={book.isCompleted ? "green.6" : "dark.1"}
              variant="transparent">
              <IconCircleCheckFilled />
            </ThemeIcon>
            <Link
              to={`/books/${book.id}/pages/${book.currentPage}`}
              style={{ color: "inherit", textDecoration: "none" }}>
              <Text fw={500} fz="md" lineClamp={2}>
                {book.title}
              </Text>
            </Link>
            <Text component="span" size="xs" c="dimmed">
              ({book.currentPage}/{book.pageCount})
            </Text>
            {book.isArchived && (
              <ThemeIcon
                size="xs"
                variant="transparent"
                color="dimmed"
                opacity="0.4">
                <IconArchiveFilled />
              </ThemeIcon>
            )}
          </Group>
          <Text fz="xs" c="dimmed">
            {book.language}
          </Text>
        </div>
        <DonutChart
          size={90}
          thickness={16}
          styles={{ label: { fontSize: "0.7rem" } }}
          data={[
            { name: "USA", value: 400, color: "blue" },
            { name: "Other", value: 200, color: "red.6" },
            { name: "Other", value: 100, color: "green.6" },
            { name: "Other", value: 50, color: "orange.6" },
          ]}
          chartLabel="Statuses"
        />
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Stack gap={5}>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Word count
            </Text>
            <Text size="sm">{book.wordCount}</Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Tags
            </Text>
            <PillGroup gap={4}>
              {book.tags.map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </PillGroup>
          </Group>
          <Group justify="space-between">
            <Text size="sm" fw={500}>
              Last read
            </Text>
            <Text size="sm">
              {book.lastRead && <span>{dayjs(book.lastRead).fromNow()}</span>}
            </Text>
          </Group>
        </Stack>
      </Card.Section>
    </Card>
  );
}

export default BookCard;
