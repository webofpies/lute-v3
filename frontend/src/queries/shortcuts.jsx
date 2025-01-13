import { shortcutsQuery } from "./settings";

function loader(queryClient) {
  return async () => {
    const shortcutsData = await queryClient.ensureQueryData(shortcutsQuery);

    return { shortcutsData };
  };
}

export { loader };
