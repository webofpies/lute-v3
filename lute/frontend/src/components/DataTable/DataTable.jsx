import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, UnstyledButton, Group, Text, Center, TextInput, rem, keys } from "@mantine/core";
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from "@tabler/icons-react";
import classes from "./DataTable.module.css";
import StatsBar from "../StatsBar/StatsBar";

const EXCLUDED_KEYS = ["id"];

function Th({ children, reversed, sorted, onSort, columnWidth }) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th
      style={{ width: columnWidth && columnWidth, whiteSpace: "nowrap" }}
      className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={700} fz="md">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function excludeKeys(obj, keysToExclude) {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keysToExclude.includes(key)));
}

function filterData(data, search, keysToExclude) {
  const query = search.toLowerCase().trim();
  const d = excludeKeys(data[0], keysToExclude);

  return data.filter((item) => keys(d).some((key) => item[key].toLowerCase().includes(query)));
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search, EXCLUDED_KEYS);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search,
    EXCLUDED_KEYS
  );
}

export default function DataTable({ data }) {
  // console.log(data, "data");
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((book) => (
    <Table.Tr key={book.title}>
      <Table.Td>
        <Link to={`/read/${book.id}`} style={{ color: "inherit" }}>
          <Text lineClamp={1}>{book.title}</Text>{" "}
        </Link>
      </Table.Td>
      <Table.Td> {book.language}</Table.Td>
      <Table.Td>{book.tags}</Table.Td>
      <Table.Td>{book.wordCount}</Table.Td>
      <Table.Td>
        <StatsBar book={book} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={500} style={{ paddingInline: "3rem" }}>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing={5}
        // miw={700}
        // layout="fixed"
        striped
        highlightOnHover
        withColumnBorders
        withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Th
              sorted={sortBy === "title"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("title")}>
              Title
            </Th>
            <Th
              columnWidth="1%"
              sorted={sortBy === "language"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("language")}>
              Language
            </Th>
            <Th
              columnWidth="1%"
              sorted={sortBy === "tags"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("tags")}>
              Tags
            </Th>
            <Th
              columnWidth="1%"
              sorted={sortBy === "wordCount"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("wordCount")}>
              Word Count
            </Th>
            <Th
              columnWidth="20%"
              sorted={sortBy === "status"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("status")}>
              Status
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data[0]).length}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
