import { bookQuery, pageQuery } from "./book";
import { settingsQuery } from "@settings/api/settings";
import { definedLangInfoQuery } from "@language/api/language";
import { softwareInfoQuery } from "@settings/api/settings";

function loader(queryClient) {
  return async ({ params }) => {
    const bookData = await queryClient.ensureQueryData(bookQuery(params.id));
    const pageData = await queryClient.ensureQueryData(
      pageQuery(params.id, params.page)
    );
    const settingsData = await queryClient.ensureQueryData(settingsQuery);
    const languageData = await queryClient.ensureQueryData(
      definedLangInfoQuery(bookData?.languageId)
    );
    const softwareInfoData =
      await queryClient.ensureQueryData(softwareInfoQuery);

    return {
      bookData,
      pageData,
      settingsData,
      languageData,
      softwareInfoData,
    };
  };
}

export default loader;
