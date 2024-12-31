import { initialQuery } from "./settings";

function loader(queryClient) {
  return async () => {
    const predefList = predefinedListQueryObj();
    const defList = definedListQueryObj();
    const parsers = parsersQueryObj();
    const initial = initialQuery;

    const predefListData =
      queryClient.getQueryData(predefList.queryKey) ??
      (await queryClient.fetchQuery(predefList));

    const defListData =
      queryClient.getQueryData(defList.queryKey) ??
      (await queryClient.fetchQuery(defList));

    const parsersData =
      queryClient.getQueryData(parsers.queryKey) ??
      (await queryClient.fetchQuery(parsers));

    const initialData =
      queryClient.getQueryData(initial.queryKey) ??
      (await queryClient.fetchQuery(initial));

    return { predefListData, defListData, parsersData, initialData };
  };
}

function languageInfoQuery(langId) {
  return {
    queryKey: ["languageInfo", langId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/languages/${langId}`
      );
      return await response.json();
    },
    enabled: langId !== null,
  };
}

function predefinedListQueryObj() {
  return {
    queryKey: ["predefined"],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/languages/?type=predefined`
      );
      return await response.json();
    },
    staleTime: Infinity,
  };
}

const predefinedOptionsObj = (languageName, enabled) => {
  return {
    queryKey: ["predefinedOptions", languageName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/languages/new/${languageName}`
      );
      return await response.json();
    },
    staleTime: Infinity,
    enabled: languageName !== null && enabled,
  };
};

function definedListQueryObj() {
  return {
    queryKey: ["defined"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/api/languages`);
      return await response.json();
    },
  };
}

const definedOptionsObj = (languageName, enabled) => {
  return {
    queryKey: ["definedOptions", languageName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/languages/${languageName}`
      );
      return await response.json();
    },
    enabled: languageName !== null && enabled,
  };
};

function parsersQueryObj() {
  return {
    queryKey: ["languageParsers"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:5001/api/languages/parsers"
      );
      return await response.json();
    },
    staleTime: Infinity,
  };
}

function loadSampleStoriesQuery(language) {
  return {
    queryKey: ["sampleStories", language],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5001/api/languages/sample/${language}`
      );
      return await res.text();
    },
  };
}

export {
  loader,
  languageInfoQuery,
  definedListQueryObj,
  definedOptionsObj,
  predefinedListQueryObj,
  predefinedOptionsObj,
  parsersQueryObj,
  loadSampleStoriesQuery,
};
