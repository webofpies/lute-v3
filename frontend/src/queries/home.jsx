import { allBooksQuery } from "./books";
import { settingsQuery } from "./settings";

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

    return { settingsData, allBooksData };
  };
}

export { loader };
