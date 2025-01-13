const settingsQuery = {
  queryKey: ["settings"],
  queryFn: async () => {
    const res = await fetch("http://localhost:5001/api/settings");
    return await res.json();
  },
};

const shortcutsQuery = {
  queryKey: ["shortcuts"],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/shortcuts`);
    return await response.json();
  },
};

const softwareInfoQuery = {
  queryKey: ["version"],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/appinfo`);
    return await response.json();
  },
  staleTime: Infinity,
};

const initialQuery = {
  queryKey: ["initialQuery"],
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/initial`);
    return await response.json();
  },
  staleTime: Infinity,
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

function loader(queryClient) {
  return async () => {
    const settingsData = await queryClient.ensureQueryData(settingsQuery);

    return settingsData;
  };
}

export {
  loader,
  settingsQuery,
  shortcutsQuery,
  softwareInfoQuery,
  initialQuery,
  wipeDemoDBQuery,
  deactivateDemoQuery,
};
