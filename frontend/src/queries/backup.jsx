const backupsQuery = {
  queryKey: ["backups"],
  queryFn: async () => {
    const res = await fetch("http://localhost:5001/api/backups");
    return await res.json();
  },
};

function loader(queryClient) {
  return async () => {
    const backupsData =
      queryClient.getQueryData(backupsQuery.queryKey) ??
      (await queryClient.fetchQuery(backupsQuery));

    return backupsData;
  };
}

export { backupsQuery, loader };
