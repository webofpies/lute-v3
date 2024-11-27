function sentencesFetchOptions(langId, termId) {
  return {
    queryKey: ["sentences", langId, termId],
    queryFn: () => fetchSentences(langId, termId),
    staleTime: Infinity,
  };
}

async function fetchSentences(langId, term) {
  const res = await fetch(
    `http://localhost:5001/api/sentences/${langId}/${term}`
  );
  return await res.json();
}

export { sentencesFetchOptions, fetchSentences };
