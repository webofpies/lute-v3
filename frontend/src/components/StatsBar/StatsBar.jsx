import { Center, Loader, Progress, Tooltip } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

const statusColors = {
  0: "#d5ffff",
  1: "#f5b8a9",
  2: "#f5cca9",
  3: "#f5e1a9",
  4: "#f5f3a9",
  5: "#ddffdd",
  99: "#72da88",
};

const barTitles = {
  0: "Unknown",
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  99: "Well Known or Ignored",
};

function StatsBar({ book }) {
  const { isFetching, error, data } = useQuery({
    queryKey: ["bookStats", book.id],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/books/${book.id}/stats`
      );
      const data = await response.json();

      const statCounts = { ...data };
      statCounts["99"] = statCounts["98"] + statCounts["99"];
      delete statCounts["98"];

      const totalCount = Object.values(statCounts).reduce(
        (acc, val) => acc + val,
        0
      );
      if (totalCount === 0) {
        return null;
      }

      const statusPct = {};
      Object.entries(statCounts).forEach(([key, value]) => {
        let pct = (value * 100.0) / totalCount;
        statusPct[key] = [value, parseInt(pct.toFixed(0))];
      });

      return statusPct;
    },
    staleTime: Infinity,
  });

  if (error) return "An error has occurred: " + error.message;

  return isFetching ? (
    <Center>
      <Loader size="xs" type="dots" />
    </Center>
  ) : (
    <Progress.Root
      size={15}
      radius={3}
      style={{
        justifyContent: "space-between",
        gap: "1px",
        backgroundColor: "#696969",
        border: "1px solid #696969",
      }}>
      {data ? (
        Object.entries(data).map(([status, [count, percent]], index) => {
          const msg = `${barTitles[status]}: ${percent}% (${count} words)`;
          return (
            percent >= 1 && (
              <Tooltip key={index} label={msg}>
                <Progress.Section
                  value={percent}
                  color={statusColors[status]}
                />
              </Tooltip>
            )
          );
        })
      ) : (
        <Tooltip label="Please open the book to calculate stats">
          <Progress.Section />
        </Tooltip>
      )}
    </Progress.Root>
  );
}

export default StatsBar;
