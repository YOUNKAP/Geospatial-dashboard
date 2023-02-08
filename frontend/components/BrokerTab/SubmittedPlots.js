import { useState, useEffect, useContext } from "react";

import { MapContext, AnalysisContext } from "../AppContext/AppContext";
import mapboxgl from "mapbox-gl";
import { sortData } from "./Sorting";
import axios from "axios";
import { API_URL, errorToast, loadingToast } from "../Util";
import { toast } from "react-toastify";

export default function SubmittedPlots() {
  const [sortTrue, setSortTrue] = useState(false);
  const { setAnalysisData } = useContext(AnalysisContext);
  const { map } = useContext(MapContext);
  const [brokerData, setBrokerData] = useState([]);

  const loadBrokersData = () => {
    loadingToast("Loading Brokers data..");
    axios
      .get("/api/storebroker")
      .then((res) => {
        let data = res.data;
        data.forEach((item, i) => {
          item.id = i + 1;
        });
        setBrokerData(data);

        if (data.length !== 0 && "id" in data[0]) {
          data.map((item) => createMarker(item));
        }

        toast.dismiss("loading-toast");
      })
      .catch((error) => {
        console.log(error);
        errorToast("Failed to load Brokers data!", "top-center");
      });
  };

  const createMarker = (item) => {
    const marker = new mapboxgl.Popup({}).setLngLat([
      item.Longitude,
      item.Latitude,
    ]);

    marker.setHTML(`
    <div id=${item.id} class="plot-marker fade-in-min">
    <div class="broker-popup fade-in-min">
          <h1>${item.Name}</h1>
          <div class="detail-broker">
            <p><i class="la la-square text-success"></i> Price: $${
              item.Price
            }</p>
          </div>
          <div class="detail-broker">
            <p><i class="la la-square text-primary"></i> Company ${
              item.Company
            }</p>
          </div>
          <div class="detail-broker">
            <p><i class="la la-square text-info"></i> Email: ${item.Email}</p>
          </div>
          <div class="detail-broker">
          <p><i class="la la-vector-square text-info"></i> Size: ${
            item.Area
          }sqm</p>
        </div>
        </div>
    <div class="score-box ${colorClass(item.analysis.totalRiskScore)}">
      <span>${item.analysis.totalRiskScore.toFixed(2)}</span>
    </div>
    </div>
    `);
    marker.addTo(map);

    return marker;
  };

  const colorClass = (value) => {
    if (value > 5) {
      return "risk-box red";
    } else if (value <= 5 && value > 3) {
      return "risk-box yellow";
    } else if (value <= 3) {
      return "risk-box green";
    }
  };

  const searchData = (e) => {
    if (e.target.value === "") {
      loadBrokersData();
      return false;
    }

    loadingToast(`Searching Broker's data for: ${e.target.value}`);
    axios(`${API_URL}/storebroker?search=${e.target.value}`).then((res) => {
      if (res.data.length === 0) {
        errorToast("No results found.", "top-center");
        toast.dismiss("loading-toast");
        return false;
      }

      setBrokerData(res.data);
      toast.dismiss("loading-toast");
    });
  };

  const sortbrokerData = (tipe, e) => {
    setSortTrue(!sortTrue);
    let icon = document.getElementsByClassName("la-sort");
    let sorting = document.getElementsByClassName("sorting");

    if (e.target.className.length == 11) {
      e.target.className = "sorting desc";
      let reversedArr = [];
      for (let i = brokerData.length - 1; i >= 0; i--) {
        reversedArr.push(brokerData[i]);
      }

      setBrokerData(reversedArr);

      return;
    } else if (e.target.className.length == 12) {
      e.target.className = "sorting asc";
      let reversedArr = [];
      for (let i = brokerData.length - 1; i >= 0; i--) {
        reversedArr.push(brokerData[i]);
      }

      setBrokerData(reversedArr);

      return;
    }

    var sorted = sortData(brokerData, tipe);

    setBrokerData(sorted);

    for (let i = 0; i < icon.length; i++) {
      icon[i].className = "la la-sort";
      sorting[i].className = "sorting";
      if (tipe == "date") {
        icon[0].className = "la la-sort active";
        sorting[0].className = "sorting asc";
      } else if (tipe == "place") {
        icon[1].className = "la la-sort active";
        sorting[1].className = "sorting asc";
      } else {
        icon[2].className = "la la-sort active";
        sorting[2].className = "sorting asc";
      }
    }
  };

  useEffect(() => {
    loadBrokersData();
  }, []);

  useEffect(() => {
    setBrokerData([...brokerData]);
  }, [sortTrue]);

  const selectBroker = (item) => {
    map.flyTo({
      center: [item.Longitude, item.Latitude],
      zoom: 12,
    });
    setAnalysisData(item.analysis);
    if (item.plot_geojson) {
      map.getSource("area-polygon").setData(item.plot_geojson);
    }
  };

  return (
    <div className="submitplot-tab" id="popup-broker">
      <div className="sort">
        <input
          type="search"
          id="form1"
          className="form-control"
          placeholder="Search submitted plots.."
          aria-label="Search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchData(e);
            }
          }}
        />

        <div className="button-set mt-2">
          <button
            className="btn btn-outline-default btn-sm"
            onClick={loadBrokersData}
          >
            <i className="la la-square text-plot" /> Reload Data
          </button>

          <a href="/admin/broker-submissions">
            <button className="btn btn-default btn-sm px-3">
              See all submissions <i className="la la-arrow-right text-info" />
            </button>
          </a>
        </div>

        <div className="sort-category">
          <span
            className="sorting asc"
            onClick={(e) => sortbrokerData("date", e)}
          >
            Date <i className="la la-sort active"></i>
          </span>
          <span className="sorting" onClick={(e) => sortbrokerData("place", e)}>
            Prefecture <i className="la la-sort"></i>{" "}
          </span>
          <span className="sorting" onClick={(e) => sortbrokerData("score", e)}>
            Score <i className="la la-sort"></i>
          </span>
        </div>
      </div>

      {brokerData.map((item) => {
        return (
          <div
            className="selected-point broker-card"
            onClick={() => {
              selectBroker(item);
            }}
          >
            <div className="name-point-container">
              <div className="submitted-plot-header">
                <span className="marker-tag">
                  <i className="la la-square text-plot" /> Submitted Plot
                </span>

                <div
                  className={`score-container ${colorClass(
                    item.analysis.totalRiskScore
                  )}`}
                >
                  {item.analysis.totalRiskScore.toFixed(2)}
                </div>
              </div>
              <h2>{item.Name}</h2>

              <div className="info-items">
                <span class="info-text">
                  <i className="la la-envelope text-primary"></i> {item.Email}
                </span>
                <span class="info-text">
                  <i className="la la-vector-square text-primary"></i>{" "}
                  {item.Area} sqm
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
