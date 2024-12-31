import { allBooksQuery } from "./books";
import {
  backupQuery,
  initialQuery,
  settingsQuery,
  softwareInfoQuery,
} from "./settings";

function loader(queryClient) {
  return async () => {
    const softwareInfoData =
      queryClient.getQueryData(softwareInfoQuery.queryKey) ??
      (await queryClient.fetchQuery(softwareInfoQuery));

    const settingsData =
      queryClient.getQueryData(settingsQuery.queryKey) ??
      (await queryClient.fetchQuery(settingsQuery));

    const allBooksData =
      queryClient.getQueryData(allBooksQuery.queryKey) ??
      (await queryClient.fetchQuery(allBooksQuery));

    const initialData =
      queryClient.getQueryData(initialQuery.queryKey) ??
      (await queryClient.fetchQuery(initialQuery));

    const backupData =
      queryClient.getQueryData(backupQuery.queryKey) ??
      (await queryClient.fetchQuery(backupQuery));

    return {
      settingsData,
      allBooksData,
      initialData,
      backupData,
      softwareInfoData,
    };
  };
}

export { loader };
