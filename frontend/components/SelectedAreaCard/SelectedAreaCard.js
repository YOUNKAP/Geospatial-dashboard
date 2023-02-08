import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AnalysisContext } from "../AppContext/AppContext";

export default function SelectedAreaCard() {
  const { analysisData } = useContext(AnalysisContext);
  const [details, setDetails] = useState(null);
  useEffect(() => {
    if (analysisData) {
      setDetails(null);
      axios(
        `https://nominatim.openstreetmap.org/reverse?lat=${analysisData.lat}&lon=${analysisData.lon}&polygon_geojson=1&format=jsonv2`
      ).then((res) => {
        setDetails(res.data);
      });
    }
  }, [analysisData]);

  return (
    <>
      {analysisData && (
        <div className="selected-area-card fade-in-min">
          <span className="component-headline">
            <i className="la la-expand text-primary" /> Selected Area Details
          </span>
          {details && (
            <>
              <h2 className="mt-3 text-bold">{details.display_name}</h2>
              <span className="mt--2">
                The place you picked is a / an{" "}
                <strong className="text-primary">{details.type}</strong> area.
              </span>

              <div className="details-table">
                <div className="item">
                  <strong>
                    {" "}
                    <i className="la la-square text-danger" />
                    Risk Score:
                  </strong>
                  <span>{analysisData.totalRiskScore.toFixed(2)}</span>
                </div>
                <div className="item">
                  <strong>
                    {" "}
                    <i className="la la-square text-danger" />
                    Automatically Disqualified:
                  </strong>
                  <span>{analysisData.autoDisqualified ? "Yes" : "No"}</span>
                </div>
                <div className="item">
                  <strong>
                    {" "}
                    <i className="la la-square text-blue" />
                    Assessment:
                  </strong>
                  <span>
                    {analysisData.qualifiedArea ? "Qualified" : "Disqualified"}
                  </span>
                </div>
                <div className="item">
                  <strong>
                    <i className="la la-bullseye text-primary" /> Analysis
                    Scope:
                  </strong>
                  <span>{window.radiusKM} km</span>
                </div>
                <div className="item">
                  <strong>Address type:</strong>
                  <span>{details.addresstype}</span>
                </div>
                <div className="item">
                  <strong>Area Category:</strong>
                  <span>{details.category}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
