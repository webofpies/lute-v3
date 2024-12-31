import { Text } from "@mantine/core";
import { IconDatabase, IconPlayerPlayFilled } from "@tabler/icons-react";

const databaseCleaned = {
  title: "Database cleaned!",
  message: (
    <Text component="p" lineClamp={2} fz="sm">
      Have fun! Lute has also automatically enabled backups: change your
      Settings as needed
    </Text>
  ),
  position: "bottom-right",
  autoClose: 5000,
  withBorder: true,
  icon: <IconDatabase />,
  color: "green",
};

const demoDeactivated = {
  title: "Demo mode deactivated!",
  message: (
    <Text component="p" lineClamp={2} fz="sm">
      Have fun! Lute has also automatically enabled backups: change your
      Settings as needed
    </Text>
  ),
  position: "bottom-right",
  autoClose: 5000,
  withBorder: true,
  icon: <IconPlayerPlayFilled />,
  color: "green",
};

export { databaseCleaned, demoDeactivated };
