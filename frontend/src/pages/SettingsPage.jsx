import SettingsForm from "@settings/components/SettingsForm/SettingsForm";
import PageContainer from "@common/PageContainer/PageContainer";
import PageTitle from "@common/PageTitle/PageTitle";

function SettingsPage() {
  return (
    <PageContainer width="75%">
      <PageTitle>General settings</PageTitle>
      <SettingsForm />
    </PageContainer>
  );
}

export default SettingsPage;
