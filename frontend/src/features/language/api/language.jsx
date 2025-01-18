const keys = {
  allDefined: ["definedLanguages"],
  allPredefined: ["predefinedLanguages"],
  defined: (id) => ["definedLanguage", id],

  definedFormSettings: (id) => ["definedLanguageFormSettings", id],
  predefinedFormSettings: (name) => ["predefinedLanguageFormSettings", name],

  parsers: ["languageParsers"],
  samples: (langName) => ["sampleStories", langName],
};

const definedLangInfoQuery = (id) => ({
  queryKey: keys.defined(id),
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/languages/${id}`);
    return await response.json();
  },
  enabled: id != null && id !== "0",
});

const defFormSettingsQuery = (id) => ({
  queryKey: keys.definedFormSettings(id),
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/${id}/settings`
    );
    return await response.json();
  },
  enabled: id != null && id !== "0",
});

const predefFormSettingsQuery = (langName) => ({
  queryKey: keys.predefinedFormSettings(langName),
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/new/${langName}`
    );
    return await response.json();
  },
  staleTime: Infinity,
});

const predefinedListQuery = {
  queryKey: keys.allPredefined,
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/?type=predefined`
    );
    return await response.json();
  },
  staleTime: Infinity,
};

const definedListQuery = {
  queryKey: keys.allDefined,
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/languages`);
    return await response.json();
  },
};

const parsersQuery = {
  queryKey: keys.parsers,
  queryFn: async () => {
    const response = await fetch("http://localhost:5001/api/languages/parsers");
    return await response.json();
  },
  staleTime: Infinity,
};

const loadSampleStoriesQuery = (langName) => ({
  queryKey: keys.samples(langName),
  queryFn: async () => {
    const res = await fetch(
      `http://localhost:5001/api/languages/${langName}/sample`
    );
    return await res.text();
  },
});

export {
  definedListQuery,
  predefinedListQuery,
  parsersQuery,
  definedLangInfoQuery,
  defFormSettingsQuery,
  predefFormSettingsQuery,
  loadSampleStoriesQuery,
};
