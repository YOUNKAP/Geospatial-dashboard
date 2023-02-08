import BrokerSubmissionsPage from "../../components/AdminPanel/BrokerSubmissionPage";
import ManageUsersPage from "../../components/AdminPanel/ManageUserPage";
import PageLoader from "../../components/AdminPanel/PageLoader";
import ProfileAdminPage from "../../components/AdminPanel/ProfileAdminPage";
import ScoringEditorPage from "../../components/AdminPanel/ScoringEditorPage";
import Layout from "../../components/Layout/Layout";

const AdminPage = (props) => {
  const { slug } = props;
  return (
    <Layout>
      <PageLoader />
      {slug === "profile" && <ProfileAdminPage />}
      {slug === "broker-submissions" && <BrokerSubmissionsPage />}
      {slug === "scoring-algorithm-editor" && <ScoringEditorPage />}
      {slug === "manage-users" && <ManageUsersPage />}
    </Layout>
  );
};

AdminPage.getInitialProps = (ctx) => {
  return { slug: ctx.query.slug };
};

export default AdminPage;
