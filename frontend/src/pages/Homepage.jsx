import { useNavigation } from "react-router-dom";
import BookTable from "../components/BookTable/BookTable";
import { useEffect } from "react";
import { nprogress } from "@mantine/nprogress";

function Homepage() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.state === "loading" && nprogress.start();
  }, [navigation.state]);

  return <BookTable />;
}

export default Homepage;
