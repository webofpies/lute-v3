import { Drawer, ScrollAreaAutosize } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NewBookForm from "../components/NewBookForm/NewBookForm";
import LanguageForm from "../components/LanguageForm/LanguageForm";
import PageContainer from "../components/PageContainer/PageContainer";

function NewBook() {
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
                <LanguageForm />
              </PageContainer>
            </Drawer.Body>
          </ScrollAreaAutosize>
        </Drawer.Content>
      </Drawer.Root>
      <NewBookForm openDrawer={open} />
    </>
  );
}

export default NewBook;
