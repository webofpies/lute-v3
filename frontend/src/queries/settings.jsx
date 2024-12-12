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

export { loader, settingsQuery };
