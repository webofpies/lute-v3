import { initialQuery } from "@settings/api/settings";
import {
  definedListQuery,
  parsersQuery,
  predefFormSettingsQuery,
  predefinedListQuery,
} from "./language";

function loader(queryClient) {
  return async () => {
    const predefListData =
      await queryClient.ensureQueryData(predefinedListQuery);
    const defListData = await queryClient.ensureQueryData(definedListQuery);
    const parsersData = await queryClient.ensureQueryData(parsersQuery);
    const initialData = await queryClient.ensureQueryData(initialQuery);
    const predefinedSettingsData = await queryClient.ensureQueryData(
      predefFormSettingsQuery(null)
    );

    return {
      predefListData,
      defListData,
      parsersData,
      initialData,
      predefinedSettingsData,
    };
  };
}

export default loader;
