import { useContext } from "react";
import { AnalysisContext, UserContext } from "../AppContext/AppContext";

const ScoreFactorFeed = () => {
  const { analysisData } = useContext(AnalysisContext);
  const { user } = useContext(UserContext);

  return (
    <>
      {user && analysisData && analysisData.scoreFactors.length !== 0 && (
        <div className="score-factor-feed fade-in-bottom">
          <div className="sidebar-header">
            <div className="title-bar">
              <div className="title">
                <h2>
                  <i className="la la-chart-area text-primary" /> Analysis
                  Results ({analysisData.scoreFactors.length})
                </h2>
                <h3>
                  <i className="la la-square text-warning" /> Break down of the
                  analysis results.
                </h3>
              </div>
            </div>
          </div>

          <div className="risk-header">
            <div className="sidebar-container">
              <div className="data-list">
                {analysisData.factorSummary.map((layer, index) => {
                  return (
                    <div
                      className={`data-item ${
                        Number(layer.minDistance) >
                        Number(layer.distance.calculated / 1000)
                          ? "dq-zone"
                          : ""
                      }`}
                      key={index}
                    >
                      <div className="d-flex">
                        <img src={layer.icon} />
                        <div className="data-info">
                          <span className="headline">{layer.name}</span>
                          {/* <small>
                            <i
                              className={`la la-square ${
                                layer.riskWeight > 2
                                  ? "text-danger"
                                  : "text-success"
                              }`}
                            />{" "}
                            Total detections: <strong>{layer.count}</strong>
                          </small> */}
                          <small>
                            <i
                              className={`la la-expand-arrows-alt text-primary`}
                            />{" "}
                            Closest Detection:{" "}
                            <strong>
                              {(layer.distance.calculated / 1000).toFixed(2)}km
                            </strong>
                          </small>
                          <small>
                            <i className={`la la-bullseye text-danger`} /> Risk
                            Weight: <strong>{layer.riskWeight}</strong>
                          </small>

                          {layer.minDistance ? (
                            <small>
                              <i className={`la la-square text-danger`} />{" "}
                              Disqualification zone:{" "}
                              <strong>{layer.minDistance.toFixed(2)}km</strong>
                            </small>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {analysisData.scoreFactors.map((item, index) => {
                return (
                  <div className={`factor-card`}>
                    <div className="line-bar"></div>
                    <div className="header">
                      <span className="headline">
                        <i className={`la la-square ${item.iconColor} mr-1`} />
                        {item.name}
                      </span>
                      <span>
                        {(item.distance.calculated / 1000).toFixed(2)}km
                      </span>
                    </div>

                    <div className="details-table">
                      {Object.keys(item.details).map((x) => {
                        return (
                          <div className="item">
                            <strong>{x}:</strong>
                            <span>{item.details[x]}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* <div className="cta">
                      <span>VIEW</span>
                      <div className="arrow">
                        <i className="la la-chevron-circle-right" />
                      </div>
                    </div> */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScoreFactorFeed;
