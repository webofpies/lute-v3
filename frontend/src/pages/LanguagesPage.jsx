import LanguageForm from "@language/components/LanguageForm/LanguageForm";
import PageContainer from "@common/PageContainer/PageContainer";
import PageTitle from "@common/PageTitle/PageTitle";

function LanguagesPage() {
  return (
    <PageContainer width="75%">
      <PageTitle>Create or edit a language</PageTitle>
      <LanguageForm />
    </PageContainer>
  );
}

export default LanguagesPage;
