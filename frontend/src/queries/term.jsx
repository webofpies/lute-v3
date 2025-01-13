import { keepPreviousData } from "@tanstack/react-query";
import { definedListQuery } from "./language";
import { initialQuery } from "./settings";

const termDataQuery = (id) => ({
  queryKey: ["termData", id],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/terms/${id}`);
    return await response.json();
  },
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
  enabled: id !== null,
});

const popupQuery = (id) => ({
  queryKey: ["popupData", id],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/terms/${id}/popup`);
    return await response.json();
  },
  enabled: id !== null,
});

const termSuggestionsQuery = (searchText, langid) => ({
  queryKey: ["termSuggestions", searchText, langid],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/terms/${langid}/${searchText}`
    );
    return await response.json();
  },
  enabled: searchText !== "" && langid != null,
});

const tagSuggestionsQuery = {
  queryKey: ["tagSuggestions"],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/terms/tags/suggestions`
    );
    return await response.json();
  },
};

const tagsQuery = {
  queryKey: ["termTags"],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/terms/tags`);
    return await response.json();
  },
};

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

export {
  termDataQuery,
  popupQuery,
  termSuggestionsQuery,
  tagSuggestionsQuery,
  tagsQuery,
  loader,
};
