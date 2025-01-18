import { definedListQuery } from "@language/api/language";
import { initialQuery } from "@settings/api/settings";
import { tagsQuery, tagSuggestionsQuery } from "./term";

function loader(queryClient) {
  return async () => {
    const defListData = await queryClient.ensureQueryData(definedListQuery);
    const tagSuggestionsData =
      await queryClient.ensureQueryData(tagSuggestionsQuery);
    const tagsData = await queryClient.ensureQueryData(tagsQuery);
    const initialData = await queryClient.ensureQueryData(initialQuery);

    return { defListData, initialData, tagsData, tagSuggestionsData };
  };
}

export default loader;
