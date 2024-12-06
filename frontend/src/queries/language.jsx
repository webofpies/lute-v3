function loader(queryClient) {
  return async () => {
    const predefList = predefinedListQueryObj();
    const defList = definedListQueryObj();
    const parsers = parsersQueryObj();

    const predefListData =
      queryClient.getQueryData(predefList.queryKey) ??
      (await queryClient.fetchQuery(predefList));

    const defListData =
      queryClient.getQueryData(defList.queryKey) ??
      (await queryClient.fetchQuery(defList));

    const parsersData =
      queryClient.getQueryData(parsers.queryKey) ??
      (await queryClient.fetchQuery(parsers));

    return { predefListData, defListData, parsersData };
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

function definedListQueryObj() {
  return {
    queryKey: ["defined"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/api/languages`);
      return await response.json();
    },
  };
}

const definedOptionsObj = (languageName) => {
  return {
    queryKey: ["definedOptions", languageName],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/languages/${languageName}`
      );
      return await response.json();
    },
    enabled: languageName !== null,
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

export {
  loader,
  definedListQueryObj,
  definedOptionsObj,
  predefinedListQueryObj,
  predefinedOptionsObj,
  parsersQueryObj,
};
