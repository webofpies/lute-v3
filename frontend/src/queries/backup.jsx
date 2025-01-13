const backupsQuery = {
  queryKey: ["backups"],
  queryFn: async () => {
    const res = await fetch("http://localhost:5001/api/backups");
    return await res.json();
  },
};

function loader(queryClient) {
  return async () => {
    const backupsData = await queryClient.ensureQueryData(backupsQuery);

    return backupsData;
  };
}

export { backupsQuery, loader };
