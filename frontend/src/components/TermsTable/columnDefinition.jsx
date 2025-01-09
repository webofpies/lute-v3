import { Pill, PillGroup } from "@mantine/core";
import StatusCell from "./StatusCell";
import TranslationCell from "./TranslationCell";
import statusLabels from "../../misc/statusLabels";

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
    Cell: ({ row }) => <TranslationCell row={row} />,
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
    Cell: ({ row }) => <StatusCell row={row} />,
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
      label: (value) => statusLabels[value],
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
