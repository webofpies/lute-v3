const backupsQuery = {
  queryKey: ["backups"],
  queryFn: async () => {
    const res = await fetch("http://localhost:5001/api/backups");
    return await res.json();
  },
};

export { backupsQuery };
