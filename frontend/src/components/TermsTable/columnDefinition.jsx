import { Link } from "react-router-dom";
import {
  Group,
  Image,
  Pill,
  PillGroup,
  rem,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCheck,
  IconMinus,
  IconNumber0,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber5,
} from "@tabler/icons-react";

const status = {
  0: { icon: IconNumber0, label: "Unknown" },
  1: { icon: IconNumber1, label: "New" },
  2: { icon: IconNumber2, label: "New" },
  3: { icon: IconNumber3, label: "Learning" },
  4: { icon: IconNumber4, label: "Learning" },
  5: { icon: IconNumber5, label: "Learned" },

  6: { icon: IconCheck, label: "Well Known" },
  7: { icon: IconMinus, label: "Ignored" },

  98: { icon: IconMinus, label: "Ignored" },
  99: { icon: IconCheck, label: "Well Known" },
};

const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const columnDefinition = (languageChoices, tagChoices) => [
  {
    header: "Term",
    accessorKey: "text",
    minSize: 300,
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    enableClickToCopy: false,
    Cell: ({ row }) => (
      <Link
        to={`/terms/term?termId=${row.original.id}&langId=${row.original.languageId}`}
        style={{ color: "inherit", textDecoration: "none" }}>
        <Text size="sm" lineClamp={1}>
          {row.original.text}
        </Text>
      </Link>
    ),
  },
  {
    header: "Parent",
    accessorKey: "parentText",
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    minSize: 200,
  },
  {
    header: "Translation",
    accessorKey: "translation",
    columnFilterModeOptions: ["contains", "startsWith", "endsWith"],
    minSize: 300,
    size: 400,
    Cell: ({ row }) => {
      const img = row.original.image;
      return (
        <>
          <Text size="sm" component="span">
            {row.original.translation}
          </Text>
          {img && (
            <Image src={`http://localhost:5001${img}`} h={150} w="auto" />
          )}
        </>
      );
    },
  },
  {
    header: "Status",
    id: "status",
    filterVariant: "range-slider",
    enableColumnFilterModes: false,
    enableClickToCopy: false,
    size: 210,
    accessorFn: (row) => {
      let id = row.statusId;
      if (row.statusId == 99) id = 6;
      if (row.statusId == 98) id = 7;
      return id;
    },
    Cell: ({ row }) => {
      const id = row.original.statusId;
      const Icon = status[id].icon;
      return (
        <Group gap={6}>
          <ThemeIcon
            variant="filled"
            size={rem(20)}
            radius="50%"
            color={`var(--lute-color-highlight-status${id}`}>
            {<Icon color={`var(--lute-text-color-status${id})`} size="80%" />}
          </ThemeIcon>
          <Text size="sm">{status[id].label}</Text>
        </Group>
      );
    },
    mantineFilterRangeSliderProps: {
      min: 0,
      max: 7,
      step: 1,
      minRange: 0,
      marks: [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
      ],
      label: (value) => status[value].label,
    },
  },
  {
    header: "Language",
    accessorKey: "language",
    filterVariant: "select",
    columnFilterModeOptions: false,
    mantineFilterSelectProps: {
      data: languageChoices.map((lang) => lang.name),
    },
    enableClickToCopy: false,
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
  {
    header: "Added On",
    id: "createdOn",
    filterVariant: "date-range",
    accessorFn: (originalRow) => new Date(originalRow.createdOn),
    columnFilterModeOptions: false,
    enableClickToCopy: false,
    Cell: ({ cell }) => dateFormatter.format(cell.getValue()),
    mantineFilterDateInputProps: {
      miw: 100,
    },
  },
];

export default columnDefinition;
