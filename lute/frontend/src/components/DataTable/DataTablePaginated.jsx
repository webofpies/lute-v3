import { Center, Pagination } from "@mantine/core";
import DataTable from "./DataTable";
import { useState } from "react";

function DataTablePaginated({ data, numItems }) {
  const [page, setPage] = useState(1);
  const paginatedData = chunk(data, numItems);
  return (
    <>
      {/* key is needed for rerender */}
      <DataTable key={page} data={paginatedData[page - 1]} />
      <Center>
        <Pagination
          value={page}
          onChange={setPage}
          onNextPage={() => setPage((p) => p + 1)}
          onPreviousPage={() => setPage((p) => p - 1)}
          total={paginatedData.length}
          withEdges
        />
      </Center>
    </>
  );
}

function chunk(array, size) {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

export default DataTablePaginated;
