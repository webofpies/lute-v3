const sentencesQuery = (langId, termId) => ({
  queryKey: ["sentences", termId, langId],
  queryFn: async () => {
    const response = await fetch(
      `http://localhost:5001/api/terms/${termId}/${langId}/sentences`
    );
    return await response.json();
  },
  staleTime: Infinity,
});

export { sentencesQuery };
