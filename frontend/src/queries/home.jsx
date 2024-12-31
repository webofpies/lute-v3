import { allBooksQuery } from "./books";
import { backupQuery, initialQuery, settingsQuery } from "./settings";

function loader(queryClient) {
  return async () => {
    const settings = settingsQuery();
    const allBooks = allBooksQuery();

    const settingsData =
      queryClient.getQueryData(settings.queryKey) ??
      (await queryClient.fetchQuery(settings));

    const allBooksData =
      queryClient.getQueryData(allBooks.queryKey) ??
      (await queryClient.fetchQuery(allBooks));

    const initialData =
      queryClient.getQueryData(initialQuery.queryKey) ??
      (await queryClient.fetchQuery(initialQuery));

    const backupData =
      queryClient.getQueryData(backupQuery.queryKey) ??
      (await queryClient.fetchQuery(backupQuery));

    return { settingsData, allBooksData, initialData, backupData };
  };
}

export { loader };
