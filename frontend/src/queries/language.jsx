import { initialQuery } from "./settings";

const definedLangInfoQuery = (id) => ({
  queryKey: ["definedInfo", id],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/languages/${id}`);
    return await response.json();
  },
  enabled: id != null && id !== "0",
});

const definedLangFormSettingsQuery = (id) => ({
  queryKey: ["definedFormSettings", id],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/${id}/settings`
    );
    return await response.json();
  },
  enabled: id != null && id !== "0",
});

const predefinedLangFormSettingsQuery = (name) => ({
  queryKey: ["predefinedFormSettings", name],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/new/${name}`
    );
    return await response.json();
  },
  staleTime: Infinity,
  enabled: name !== null,
});

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
  definedLangInfoQuery,
  definedLangFormSettingsQuery,
  predefinedLangFormSettingsQuery,
  loadSampleStoriesQuery,
};
