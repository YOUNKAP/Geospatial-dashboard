import { useContext } from "react";
import { AnalysisContext, UserContext } from "../AppContext/AppContext";

export default function () {
  const { analysisData, setAnalysisData } = useContext(AnalysisContext);
  const value = analysisData ? analysisData.totalRiskScore : 0;

  let riskLevel = null;
  const colorClass = (value) => {
    if (value > 5) {
      riskLevel = "High Risk Level";
      return "risk-box red";
    } else if (value <= 5 && value > 3) {
      riskLevel = "Moderate Risk Level";
      return "risk-box yellow";
    } else if (value <= 3) {
      riskLevel = "Low Risk Level";
      return "risk-box green";
    }
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
    var popup = document.querySelectorAll(".mapboxgl-popup-content");

    popup.forEach((box) => {
      box.remove();
    });
  };

  const { user } = useContext(UserContext);

  return (
    <>
      {analysisData && user && (
        <div className="risk-indicator-card fade-in-bottom">
          <div className="risk-indicator">
            <div className={colorClass(value)}>
              {!analysisData.autoDisqualified && (
                <>
                  <h1>{value.toFixed(2)}</h1>
                  <h3>{riskLevel}</h3>
                </>
              )}
              {analysisData.autoDisqualified && (
                <div className="dq-info">
                  <h1>Disqualified</h1>
                  <span>
                    The selected area failed to statisfy proximity rules.
                  </span>
                </div>
              )}
              <i className="la la-close" onClick={() => resetAnalysis()}></i>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
