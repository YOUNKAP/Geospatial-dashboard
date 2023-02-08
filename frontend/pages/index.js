import AppContext from "../components/AppContext/AppContext";
import Layout from "../components/Layout/Layout";
import Map from "../components/Map/Map";
import RiskIndicator from "../components/RiskIndicator/RiskIndicator";
import ScoreFactorFeed from "../components/ScoreFactorFeed/ScoreFactorFeed";
import Sidebar from "../components/Sidebar/Sidebar";

export default function Home() {
  return (
    <>
      <AppContext>
        <Layout>
          <Map />
          <Sidebar />
          <RiskIndicator />
          <ScoreFactorFeed />
        </Layout>
      </AppContext>
    </>
  );
}
