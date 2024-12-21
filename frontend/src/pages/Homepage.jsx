import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useComputedColorScheme } from "@mantine/core";
import BookTable from "../components/BookTable/BookTable";
import { settingsQuery } from "../queries/settings";
import { applyLuteHighlights } from "../misc/actions";

function Homepage() {
  const colorScheme = useComputedColorScheme();
  const { data: settings } = useQuery(settingsQuery());

  useEffect(() => {
    applyLuteHighlights(settings.highlights.status, colorScheme);
    applyLuteHighlights(settings.highlights.general, colorScheme);
  }, [colorScheme, settings.highlights]);

  return <BookTable />;
}

export default Homepage;
