import { useEffect } from "react";
import { useNavigation } from "react-router-dom";
import { nprogress } from "@mantine/nprogress";

function useNavigationProgress() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.state === "loading" ? nprogress.start() : nprogress.complete();
  }, [navigation.state]);
}

export default useNavigationProgress;
