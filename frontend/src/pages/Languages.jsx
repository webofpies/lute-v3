import LanguageForm from "../components/LanguageForm/LanguageForm";
import PageContainer from "../components/PageContainer/PageContainer";
import PageTitle from "../components/PageTitle/PageTitle";

function Languages() {
  return (
    <PageContainer width="75%">
      <PageTitle>Create or edit a language</PageTitle>
      <LanguageForm />
    </PageContainer>
  );
}

export default Languages;
