import { memo } from "react";
import { Progress, Tooltip } from "@mantine/core";
import classes from "./StatsBar.module.css";

const labels = {
  0: "Unknown",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  99: "Well Known or Ignored",
};

function StatsBar({ data }) {
  return (
    <Progress.Root size={16} radius={10} className={classes.bar}>
      {data ? (
        Object.entries(data).map(
          ([status, { wordCount, percentage }], index) => {
            const msg = `${labels[status]}: ${percentage.toFixed(0)}% (${wordCount} words)`;
            return (
              percentage >= 1 && (
                <Tooltip key={index} label={msg}>
                  <Progress.Section
                    value={percentage}
                    color={`var(--lute-color-highlight-status${status}`}
                  />
                </Tooltip>
              )
            );
          }
        )
      ) : (
        <Tooltip label="Please open the book to calculate stats">
          <Progress.Section />
        </Tooltip>
      )}
    </Progress.Root>
  );
}

export default memo(StatsBar);
