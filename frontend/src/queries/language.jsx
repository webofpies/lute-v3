const predefinedListQueryObj = {
  queryKey: ["predefined"],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/languages/?type=predefined`
    );
    return await response.json();
  },
  staleTime: Infinity,
  enabled: false,
};

const definedListQueryObj = {
  queryKey: ["defined"],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/languages`);
    return await response.json();
  },
  staleTime: Infinity,
  enabled: false,
};

const predefinedOptionsObj = (languageName) => {
  return {
    queryKey: ["predefinedOptions", languageName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/languages/new/${languageName}`
      );
      return await response.json();
    },
    staleTime: Infinity,
    enabled: languageName !== null,
  };
};

const parsersQueryObj = {
  queryKey: ["languageParsers"],
  queryFn: async () => {
    const response = await fetch("http://localhost:5001/api/languages/parsers");
    return await response.json();
  },
  staleTime: Infinity,
};

export {
  predefinedOptionsObj,
  definedListQueryObj,
  predefinedListQueryObj,
  parsersQueryObj,
};
