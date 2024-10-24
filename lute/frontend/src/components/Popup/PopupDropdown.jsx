import { useQuery } from "@tanstack/react-query";
import PopupInfo from "./PopupInfo";
import { Loader } from "@mantine/core";

export default function PopupDropdown({ id }) {
  const show = true;
  const { isFetching, data } = useQuery({
    queryKey: ["popupData", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/read/popup/${id}`);
      return await response.json();
    },
    enabled: show && id !== null,
    staleTime: Infinity,
  });

  return isFetching ? <Loader type="dots" /> : <PopupInfo data={data} />;
}
