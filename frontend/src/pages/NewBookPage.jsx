import { Drawer, ScrollAreaAutosize } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NewBookForm from "@book/components/NewBookForm/NewBookForm";
import LanguageForm from "@language/components/LanguageForm/LanguageForm";
import PageContainer from "@common/PageContainer/PageContainer";
import PageTitle from "@common/PageTitle/PageTitle";

function NewBookPage() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Drawer.Root
        returnFocus
        transitionProps={{ duration: 150 }}
        opened={opened}
        onClose={close}
        position="bottom"
        // TODO drag and drop issue with non 100% (temporary)
        size="100%">
        <Drawer.Overlay />
        <Drawer.Content>
          <PageContainer>
            <ScrollAreaAutosize mah="100%">
              <Drawer.Header pt={32}>
                <PageTitle>Create a new language</PageTitle>
                <Drawer.CloseButton />
              </Drawer.Header>
              <Drawer.Body>
                <LanguageForm />
              </Drawer.Body>
            </ScrollAreaAutosize>
          </PageContainer>
        </Drawer.Content>
      </Drawer.Root>
      <PageContainer width="75%">
        <PageTitle>Create a new book</PageTitle>
        <NewBookForm openDrawer={open} />
      </PageContainer>
    </>
  );
}

export default NewBookPage;
