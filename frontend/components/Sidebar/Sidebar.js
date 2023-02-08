import { useContext, useEffect } from "react";
import { UserContext } from "../AppContext/AppContext";
import MapStyleSelector from "../MapStyleSelector/MapStyleSelector";
import SelectedAreaCard from "../SelectedAreaCard/SelectedAreaCard";
import SidebarTabs from "../SidebarTabs/SidebarTabs";
import UserProfileBar from "../UserProfileBar/UserProfileBar";
import SidebarHeader from "./SidebarHeader";
import BrokerTabs from "../BrokerTab/Brokertab";
import LoginButton from "../Sidebar/LoginButton";
import { layersWeights } from "../../utilities/layerWeights";

const Sidebar = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (localStorage.customScores) {
      let customScores = JSON.parse(localStorage.customScores);
      window.layerSettings = customScores;
    } else {
      window.layerSettings = layersWeights;
    }
  }, []);

  return (
    <>
      <LoginButton />

      <div className="sidebar">
        <SidebarHeader />
        <div className="sidebar-container">
          <UserProfileBar />
          {user && (
            <>
              <SelectedAreaCard />
              <SidebarTabs />
              <MapStyleSelector />
            </>
          )}

          {!user && (
            <>
              <BrokerTabs />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
