function sentencesFetchOptions(langId, termId) {
  return {
    queryKey: ["sentences", termId, langId],
    queryFn: () => fetchSentences(langId, termId),
    staleTime: Infinity,
  };
}

async function fetchSentences(langId, term) {
  const res = await fetch(
    `http://localhost:5001/api/terms/${term}/${langId}/sentences`
  );
  return await res.json();
}

export { sentencesFetchOptions, fetchSentences };
