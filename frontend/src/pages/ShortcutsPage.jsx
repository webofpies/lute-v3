import { useQuery } from "@tanstack/react-query";
import PageContainer from "@common/PageContainer/PageContainer";
import PageTitle from "@common/PageTitle/PageTitle";
import ShortcutsForm from "@settings/components/ShortcutsForm/ShortcutsForm";
import { shortcutsQuery } from "@settings/api/settings";

function ShortcutsPage() {
  const { data } = useQuery(shortcutsQuery);
  return (
    <PageContainer width="75%">
      <PageTitle>Keyboard shortcuts</PageTitle>
      <ShortcutsForm data={data} />
    </PageContainer>
  );
}

export default ShortcutsPage;
