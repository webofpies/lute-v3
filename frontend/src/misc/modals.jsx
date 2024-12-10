import { rem } from "@mantine/core";
import { modals } from "@mantine/modals";

function openSoftwareInfoModal() {
  modals.openContextModal({
    modal: "about",
    title: "About Lute",
    styles: {
      title: { fontWeight: 500 },
      content: { overflow: "unset", padding: rem(8) },
      body: { width: "max-content" },
    },
  });
}

export { openSoftwareInfoModal };
