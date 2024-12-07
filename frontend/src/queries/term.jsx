import { keepPreviousData } from "@tanstack/react-query";

function termDataQuery(key) {
  return {
    queryKey: ["termData", key],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5001/api/terms/${key}`);
      return await response.json();
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  };
}

function popupQuery(id) {
  return {
    queryKey: ["popupData", id],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/terms/${id}/popup`
      );
      return await response.json();
    },
    enabled: id !== null,
    staleTime: Infinity,
  };
}

export { termDataQuery, popupQuery };
