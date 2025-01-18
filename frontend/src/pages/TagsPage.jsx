import { useQuery } from "@tanstack/react-query";
import PageTitle from "@common/PageTitle/PageTitle";
import PageContainer from "@common/PageContainer/PageContainer";
import TagsTable from "@term/components/TagsTable/TagsTable";
import { tagsQuery } from "@term/api/term";

function TagsPage() {
  const { data } = useQuery(tagsQuery);
  return (
    <PageContainer>
      <PageTitle>Tags</PageTitle>
      <TagsTable data={data} />
    </PageContainer>
  );
}

export default TagsPage;
