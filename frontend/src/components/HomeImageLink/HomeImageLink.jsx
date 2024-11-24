import { Image } from "@mantine/core";
import { Link } from "react-router-dom";

function HomeImageLink({ size }) {
  return (
    <Link to="/">
      <Image
        w={size}
        h={size}
        src="/images/logo.png"
        style={{ objectFit: "contain" }}
      />
    </Link>
  );
}

export default HomeImageLink;
