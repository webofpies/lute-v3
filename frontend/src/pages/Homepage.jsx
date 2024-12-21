import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "react-router-dom";
import { useComputedColorScheme } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import BookTable from "../components/BookTable/BookTable";
import { settingsQuery } from "../queries/settings";
import { applyLuteHighlights } from "../misc/actions";

function Homepage() {
  const navigation = useNavigation();
  const colorScheme = useComputedColorScheme();
  const { data: settings } = useQuery(settingsQuery());

  useEffect(() => {
    applyLuteHighlights(settings.highlights.status, colorScheme);
    applyLuteHighlights(settings.highlights.general, colorScheme);
  }, [colorScheme, settings.highlights]);

  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  });

  return <BookTable />;
}

export default Homepage;
