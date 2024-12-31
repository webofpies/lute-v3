import { shortcutsQuery } from "./settings";

function loader(queryClient) {
  return async () => {
    const shortcutsData =
      queryClient.getQueryData(shortcutsQuery.queryKey) ??
      (await queryClient.fetchQuery(shortcutsQuery));

    return { shortcutsData };
  };
}

export { loader };
