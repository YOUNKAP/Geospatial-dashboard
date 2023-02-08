import { useState } from "react";
import MainTab from "../MainTab/MainTab";
import Parameters from "../Parameters/Parameters";
import SubmitPage from "../BrokerTab/SubmittedPlots";
import SubmittedPlots from "../BrokerTab/SubmittedPlots";
export default function SidebarTabs() {
  const [paramsToggle, setParamsToggle] = useState(0);

  const changeParam = (index) => {
    setParamsToggle(index);
  };
  return (
    <div className="parameters">
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label
          className={
            "btn btn-secondary " + (paramsToggle === 0 ? "active" : "")
          }
          onClick={() => changeParam(0)}
        >
          Categories
        </label>
        <label
          className={
            "btn btn-secondary " + (paramsToggle === 1 ? "active" : "")
          }
          onClick={() => changeParam(1)}
        >
          Parameters
        </label>

        <label
          className={
            "btn btn-secondary " + (paramsToggle === 2 ? "active" : "")
          }
          onClick={() => changeParam(2)}
        >
          Broker
        </label>
      </div>

      <div className="content-tabs">
        {paramsToggle === 0 && <MainTab />}
        {paramsToggle === 1 && <Parameters />}
        {paramsToggle === 2 && <SubmittedPlots />}
      </div>
    </div>
  );
}
