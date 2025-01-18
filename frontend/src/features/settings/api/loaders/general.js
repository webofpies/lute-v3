import { settingsQuery } from "../../api/settings";

function loader(queryClient) {
  return async () => {
    const settingsData = await queryClient.ensureQueryData(settingsQuery);

    return settingsData;
  };
}

export default loader;
