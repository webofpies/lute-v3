const keys = {
  settings: ["settings"],
  shortcuts: ["shortcuts"],
  version: ["version"],
  initial: ["initial"],
  wipeDB: ["wipeDB"],
  deactivateDemo: ["deactivateDemo"],
};

const settingsQuery = {
  queryKey: keys.settings,
  queryFn: async () => {
    const res = await fetch("http://localhost:5001/api/settings");
    return await res.json();
  },
};

const shortcutsQuery = {
  queryKey: keys.shortcuts,
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/shortcuts`);
    return await response.json();
  },
};

const softwareInfoQuery = {
  queryKey: keys.version,
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/appinfo`);
    return await response.json();
  },
  staleTime: Infinity,
};

const initialQuery = {
  queryKey: keys.initial,
  queryFn: async () => {
    const response = await fetch(`http://localhost:5001/api/initial`);
    return await response.json();
  },
  staleTime: Infinity,
};

const wipeDemoDBQuery = {
  queryKey: keys.wipeDB,
  queryFn: async () => {
    const res = await fetch(`http://localhost:5001/api/wipe-database`);
    return await res.text();
  },
};

const deactivateDemoQuery = {
  queryKey: keys.deactivateDemo,
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
