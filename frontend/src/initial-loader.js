import { allBooksQuery } from "@book/api/book";
import {
  initialQuery,
  settingsQuery,
  softwareInfoQuery,
} from "@settings/api/settings";

function loader(queryClient) {
  return async () => {
    const softwareInfoData =
      await queryClient.ensureQueryData(softwareInfoQuery);
    const settingsData = await queryClient.ensureQueryData(settingsQuery);
    const allBooksData = await queryClient.ensureQueryData(allBooksQuery);
    const initialData = await queryClient.ensureQueryData(initialQuery);

    return {
      settingsData,
      allBooksData,
      initialData,
      softwareInfoData,
    };
  };
}

export default loader;
