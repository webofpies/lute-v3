import { keepPreviousData } from "@tanstack/react-query";

function termDataQuery(key) {
  return {
    queryKey: ["termData", key],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/api/terms/${key}`);
      return await response.json();
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  };
}

function popupQuery(id) {
  return {
    queryKey: ["popupData", id],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/terms/${id}/popup`
      );
      return await response.json();
    },
    enabled: id !== null,
    staleTime: Infinity,
  };
}

function termSuggestionsQuery(searchText, langid) {
  return {
    queryKey: ["termSuggestions", searchText, langid],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/terms/${langid}/${searchText}`
      );
      return await response.json();
    },
    enabled: searchText !== "" && langid != null,
  };
}

function tagSuggestionsQuery() {
  return {
    queryKey: ["tagSuggestions"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/api/terms/tags`);
      return await response.json();
    },
  };
}

export { termDataQuery, popupQuery, termSuggestionsQuery, tagSuggestionsQuery };
