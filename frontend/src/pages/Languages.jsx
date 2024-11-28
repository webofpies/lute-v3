import CreateLanguageForm from "../components/CreateLanguageForm/CreateLanguageForm";
import PageContainer from "../components/PageContainer/PageContainer";
import { predefined } from "../misc/tempdata";

function Languages() {
  return (
    <PageContainer>
      <CreateLanguageForm predefined={predefined} />
    </PageContainer>
  );
}

export default Languages;
