import { shortcutsQuery } from "../../api/settings";

function loader(queryClient) {
  return async () => {
    const shortcutsData = await queryClient.ensureQueryData(shortcutsQuery);

    return { shortcutsData };
  };
}

export default loader;
