import { initialQuery } from "./settings";

const definedLangInfoQuery = (id) => ({
  queryKey: ["definedInfo", id],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/languages/${id}`);
    return await response.json();
  },
  enabled: id != null && id !== "0",
});

const defFormSettingsQuery = (id) => ({
  queryKey: ["definedFormSettings", id],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/${id}/settings`
    );
    return await response.json();
  },
  enabled: id != null && id !== "0",
});

const predefFormSettingsQuery = (name) => ({
  queryKey: ["predefinedFormSettings", name],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/new/${name}`
    );
    return await response.json();
  },
  staleTime: Infinity,
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
      await queryClient.ensureQueryData(predefinedListQuery);
    const defListData = await queryClient.ensureQueryData(definedListQuery);
    const parsersData = await queryClient.ensureQueryData(parsersQuery);
    const initialData = await queryClient.ensureQueryData(initialQuery);
    const predefinedSettingsData = await queryClient.ensureQueryData(
      predefFormSettingsQuery(null)
    );

    return {
      predefListData,
      defListData,
      parsersData,
      initialData,
      predefinedSettingsData,
    };
  };
}

export {
  loader,
  definedListQuery,
  predefinedListQuery,
  parsersQuery,
  definedLangInfoQuery,
  defFormSettingsQuery,
  predefFormSettingsQuery,
  loadSampleStoriesQuery,
};
