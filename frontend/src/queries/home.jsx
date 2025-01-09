import { allBooksQuery } from "./books";
import { initialQuery, settingsQuery, softwareInfoQuery } from "./settings";

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

    return {
      settingsData,
      allBooksData,
      initialData,
      softwareInfoData,
    };
  };
}

export { loader };
