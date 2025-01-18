import { backupsQuery } from "./backup";

function loader(queryClient) {
  return async () => {
    const backupsData = await queryClient.ensureQueryData(backupsQuery);

    return backupsData;
  };
}

export default loader;
