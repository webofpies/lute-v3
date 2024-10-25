import { Modal } from "@mantine/core";
import About from "./About";

function AboutModal({ opened, close }) {
  return (
    <Modal.Root opened={opened} onClose={close}>
      <Modal.Overlay backgroundOpacity={0.55} blur={3} />
      <Modal.Content p="lg" flex="none">
        <Modal.Header styles={{ alignItems: "flex-start" }}>
          <Modal.Title fw={700} fz="1.5rem" mb="lg">
            About Lute
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <About />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default AboutModal;
