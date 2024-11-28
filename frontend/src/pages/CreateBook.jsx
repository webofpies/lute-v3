import { Drawer, ScrollAreaAutosize } from "@mantine/core";
import CreateBookForm from "../components/CreateBookForm/CreateBookForm";
import { useDisclosure } from "@mantine/hooks";
import CreateLanguageForm from "../components/CreateLanguageForm/CreateLanguageForm";
import PageContainer from "../components/PageContainer/PageContainer";
import { predefined } from "../misc/tempdata";

function CreateBook() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Drawer.Root
        returnFocus
        transitionProps={{ duration: 150 }}
        opened={opened}
        onClose={close}
        position="bottom"
        size="xl">
        <Drawer.Overlay />
        <Drawer.Content>
          <ScrollAreaAutosize mah="100%">
            <Drawer.Header>
              <Drawer.CloseButton />
            </Drawer.Header>
            <Drawer.Body>
              <PageContainer>
                <CreateLanguageForm predefined={predefined} />
              </PageContainer>
            </Drawer.Body>
          </ScrollAreaAutosize>
        </Drawer.Content>
      </Drawer.Root>
      <CreateBookForm openDrawer={open} />
    </>
  );
}

export default CreateBook;
