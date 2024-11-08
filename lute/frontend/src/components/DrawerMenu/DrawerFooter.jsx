import { SegmentedControl, Stack, Switch } from "@mantine/core";
import {
  IconCircleLetterAFilled,
  IconDeviceDesktop,
  IconDeviceMobile,
} from "@tabler/icons-react";
import classes from "./DrawerMenu.module.css";

function DrawerFooter() {
  return (
    <Stack gap="0.7rem" className={classes.footer}>
      <Stack
        gap="0.3rem"
        styles={{
          root: { width: "80%", marginInline: "auto" },
        }}>
        <Switch
          styles={{
            body: { justifyContent: "space-between" },
          }}
          size="md"
          label="Focus mode"
          labelPosition="left"
          onLabel="ON"
          offLabel="OFF"
        />
        <Switch
          styles={{
            body: { justifyContent: "space-between" },
          }}
          size="md"
          label="Highlights"
          labelPosition="left"
          defaultChecked
          onLabel="ON"
          offLabel="OFF"
        />
      </Stack>
      <SegmentedControl
        fullWidth
        styles={{
          label: { padding: "0.2rem" },
          innerLabel: { lineHeight: 0, display: "block" },
        }}
        size="xs"
        withItemsBorders={false}
        color="blue"
        data={[
          {
            value: "desktop",
            label: <IconDeviceDesktop />,
          },
          { value: "mobile", label: <IconDeviceMobile /> },
          {
            value: "auto",
            label: <IconCircleLetterAFilled />,
          },
        ]}
      />
    </Stack>
  );
}

export default DrawerFooter;
