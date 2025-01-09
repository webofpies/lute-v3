import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle/PageTitle";
import TermsTable from "../components/TermsTable/TermsTable";
import { initialQuery } from "../queries/settings";
import { tagSuggestionsQuery } from "../queries/term";

function Languages() {
  const { data: initial } = useQuery(initialQuery);
  const { data: tagChoices } = useQuery(tagSuggestionsQuery);
  return (
    <>
      <PageTitle>Terms</PageTitle>
      <TermsTable
        languageChoices={initial.languageChoices}
        tagChoices={tagChoices}
      />
    </>
  );
}

export default Languages;
