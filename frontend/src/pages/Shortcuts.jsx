import PageContainer from "../components/PageContainer/PageContainer";
import PageTitle from "../components/PageTitle/PageTitle";
import ShortcutsForm from "../components/ShortcutsForm/ShortcutsForm";

function Shortcuts() {
  return (
    <PageContainer width="75%">
      <PageTitle>Keyboard shortcuts</PageTitle>
      <ShortcutsForm />
    </PageContainer>
  );
}

export default Shortcuts;
