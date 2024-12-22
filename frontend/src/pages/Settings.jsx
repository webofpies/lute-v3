import SettingsForm from "../components/SettingsForm/SettingsForm";
import PageContainer from "../components/PageContainer/PageContainer";
import PageTitle from "../components/PageTitle/PageTitle";

function Settings() {
  return (
    <PageContainer width="75%">
      <PageTitle>General settings</PageTitle>
      <SettingsForm />
    </PageContainer>
  );
}

export default Settings;
