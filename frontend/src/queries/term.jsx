import { keepPreviousData } from "@tanstack/react-query";
import { definedListQuery } from "./language";
import { initialQuery } from "./settings";

const keys = {
  term: (id) => ["term", id],
  popup: (id) => ["popup", id],
  termSuggestions: (searchText, langId) => [
    "termSuggestions",
    searchText,
    langId,
  ],
  tagSuggestions: ["termTagSuggestions"],
  tags: ["termTags"],
  sentences: (termId, langId) => ["termSentences", termId, langId],
};

const termDataQuery = (id) => ({
  queryKey: keys.term(id),
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/terms/${id}`);
    return await response.json();
  },
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
  enabled: id !== null,
});

const popupQuery = (id) => ({
  queryKey: keys.popup(id),
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/terms/${id}/popup`);
    return await response.json();
  },
  enabled: id !== null,
});

const termSuggestionsQuery = (searchText, langId) => ({
  queryKey: keys.termSuggestions(searchText, langId),
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/terms/${langId}/${searchText}`
    );
    return await response.json();
  },
  enabled: searchText !== "" && langId != null,
});

const tagSuggestionsQuery = {
  queryKey: keys.tagSuggestions,
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/terms/tags/suggestions`
    );
    return await response.json();
  },
};

const tagsQuery = {
  queryKey: keys.tags,
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/terms/tags`);
    return await response.json();
  },
};

const sentencesQuery = (langId, termText) => ({
  queryKey: keys.sentences(termText, langId),
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/terms/${termText}/${langId}/sentences`
    );
    return await response.json();
  },
  staleTime: Infinity,
});

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
  sentencesQuery,
  loader,
};
