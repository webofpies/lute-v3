import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle/PageTitle";
import TermsTable from "../components/TermsTable/TermsTable";
import { initialQuery } from "../queries/settings";

function Languages() {
  const { data: initial } = useQuery(initialQuery);
  return (
    <>
      <PageTitle>Terms</PageTitle>
      <TermsTable languageChoices={initial.languageChoices} />
    </>
  );
}

export default Languages;
