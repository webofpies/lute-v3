import { Link } from "react-router-dom";
import { Group, Pill, PillGroup, Text, ThemeIcon } from "@mantine/core";
import { IconArchiveFilled, IconCircleCheckFilled } from "@tabler/icons-react";
import StatsBar from "../StatsBar/StatsBar";

const columnDefinition = (languageChoices, tagChoices) => [
  {
    header: "Title",
    accessorKey: "title",
    minSize: 600,
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    Cell: ({ row }) => {
      const currentPage = row.original.currentPage;
      const pageCount = row.original.pageCount;
      const title = row.original.title;
      const isCompleted = row.original.isCompleted;
      const isArchived = row.original.isArchived;
      return (
        <Group gap={5} align="center">
          <ThemeIcon
            size="sm"
            color={isCompleted ? "green.6" : "dark.1"}
            variant="transparent">
            <IconCircleCheckFilled />
          </ThemeIcon>
          <Link
            to={`/books/${row.original.id}/pages/${currentPage}`}
            style={{ color: "inherit", textDecoration: "none" }}>
            <Text lineClamp={1}>{title}</Text>
          </Link>
          {currentPage > 1 && (
            <Text component="span" size="sm" c="dimmed">
              ({currentPage}/{pageCount})
            </Text>
          )}
          {isArchived && (
            <ThemeIcon
              size="xs"
              variant="transparent"
              color="dimmed"
              opacity="0.4">
              <IconArchiveFilled />
            </ThemeIcon>
          )}
        </Group>
      );
    },
  },
  {
    header: "Language",
    accessorKey: "language",
    filterVariant: "select",
    columnFilterModeOptions: false,
    mantineFilterSelectProps: {
      data: languageChoices,
    },
  },
  {
    header: "Word Count",
    accessorKey: "wordCount",
    columnFilterModeOptions: ["equals", "greaterThan", "lessThan", "notEquals"],
  },
  {
    header: "Status",
    id: "status",
    accessorFn: (row) => row.unknownPercent,
    Cell: ({ row }) => <StatsBar id={row.original.id} />,
    columnFilterModeOptions: ["equals", "greaterThan", "lessThan", "notEquals"],
    mantineFilterTextInputProps: {
      placeholder: "Filter by Unknown %",
    },
  },
  {
    header: "Tags",
    id: "tags",
    mantineFilterSelectProps: {
      data: tagChoices,
    },
    filterVariant: "select",
    columnFilterModeOptions: false,
    accessorFn: (row) => (row.tags.length > 0 ? row.tags.join() : ""),
    Cell: ({ row }) => (
      <PillGroup gap={4}>
        {row.original.tags.map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
      </PillGroup>
    ),
  },
];

export default columnDefinition;
