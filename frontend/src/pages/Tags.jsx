import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle/PageTitle";
import PageContainer from "../components/PageContainer/PageContainer";
import TagsTable from "../components/TagsTable/TagsTable";
import { tagsQuery } from "../queries/term";

function Tags() {
  const { data } = useQuery(tagsQuery);
  return (
    <PageContainer>
      <PageTitle>Tags</PageTitle>
      <TagsTable data={data} />
    </PageContainer>
  );
}

export default Tags;
