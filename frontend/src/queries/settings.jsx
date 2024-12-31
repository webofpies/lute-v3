function loader(queryClient) {
  return async () => {
    const settings = settingsQuery();

    const settingsData =
      queryClient.getQueryData(settings.queryKey) ??
      (await queryClient.fetchQuery(settings));

    return settingsData;
  };
}

function settingsQuery() {
  return {
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/api/settings");
      return await res.json();
    },
  };
}

const initialQuery = {
  queryKey: ["initialQuery"],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/initial`);
    return await response.json();
  },
  staleTime: Infinity,
};

const backupQuery = {
  queryKey: ["backup"],
  queryFn: async () => {
    const res = await fetch("http://localhost:5001/api/backup");
    return await res.json();
  },
};

const wipeDemoDBQuery = {
  queryKey: ["wipeDatabase"],
  queryFn: async () => {
    const res = await fetch(`http://localhost:5001/api/wipe-database`);
    return await res.text();
  },
};

const deactivateDemoQuery = {
  queryKey: ["deactivateDemo"],
  queryFn: async () => {
    const res = await fetch(`http://localhost:5001/api/deactivate-demo`);
    return await res.text();
  },
};

export {
  loader,
  settingsQuery,
  initialQuery,
  backupQuery,
  wipeDemoDBQuery,
  deactivateDemoQuery,
};
