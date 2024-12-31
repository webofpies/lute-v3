import { initialQuery } from "./settings";

const predefinedListQuery = {
  queryKey: ["predefined"],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/?type=predefined`
    );
    return await response.json();
  },
  staleTime: Infinity,
};

const definedListQuery = {
  queryKey: ["defined"],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/languages`);
    return await response.json();
  },
};

const parsersQuery = {
  queryKey: ["languageParsers"],
  queryFn: async () => {
    const response = await fetch("http://localhost:5001/api/languages/parsers");
    return await response.json();
  },
  staleTime: Infinity,
};

const languageInfoQuery = (langId) => ({
  queryKey: ["languageInfo", langId],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/${langId}`
    );
    return await response.json();
  },
  enabled: langId !== null,
});

const predefinedOptionsObj = (languageName, enabled) => ({
  queryKey: ["predefinedOptions", languageName],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/new/${languageName}`
    );
    return await response.json();
  },
  staleTime: Infinity,
  enabled: languageName !== null && enabled,
});

const definedOptionsObj = (languageName, enabled) => ({
  queryKey: ["definedOptions", languageName],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/${languageName}`
    );
    return await response.json();
  },
  enabled: languageName !== null && enabled,
});

const loadSampleStoriesQuery = (language) => ({
  queryKey: ["sampleStories", language],
  queryFn: async () => {
    const res = await fetch(
      `http://localhost:5001/api/languages/sample/${language}`
    );
    return await res.text();
  },
});

function loader(queryClient) {
  return async () => {
    const predefListData =
      queryClient.getQueryData(predefinedListQuery.queryKey) ??
      (await queryClient.fetchQuery(predefinedListQuery));

    const defListData =
      queryClient.getQueryData(definedListQuery.queryKey) ??
      (await queryClient.fetchQuery(definedListQuery));

    const parsersData =
      queryClient.getQueryData(parsersQuery.queryKey) ??
      (await queryClient.fetchQuery(parsersQuery));

    const initialData =
      queryClient.getQueryData(initialQuery.queryKey) ??
      (await queryClient.fetchQuery(initialQuery));

    return { predefListData, defListData, parsersData, initialData };
  };
}

export {
  loader,
  definedListQuery,
  predefinedListQuery,
  parsersQuery,
  languageInfoQuery,
  definedOptionsObj,
  predefinedOptionsObj,
  loadSampleStoriesQuery,
};
