import { useQuery } from "@tanstack/react-query";
import PageContainer from "../components/PageContainer/PageContainer";
import PageTitle from "../components/PageTitle/PageTitle";
import ShortcutsForm from "../components/ShortcutsForm/ShortcutsForm";
import { shortcutsQuery } from "../queries/settings";

function Shortcuts() {
  const { data } = useQuery(shortcutsQuery);
  return (
    <PageContainer width="75%">
      <PageTitle>Keyboard shortcuts</PageTitle>
      <ShortcutsForm data={data} />
    </PageContainer>
  );
}

export default Shortcuts;
