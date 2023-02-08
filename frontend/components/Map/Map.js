import mapboxgl from "mapbox-gl";
import { useContext, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  AnalysisContext,
  MapContext,
  PlotContext,
} from "../AppContext/AppContext";
import Coordinate from "../Map/Coordinate";
import axios from "axios";
import { errorToast } from "../Util";
import { loadMapLayers } from "./MapSources";
import { loadMapLegends } from "./MapLegends";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import tfArea from "@turf/area";
import tfCentroid from "@turf/centroid";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJ5Y2UwNiIsImEiOiJjazNmbndybm4wMDk3M29wZ2dicjlmb29iIn0.NVknKG525ZpQVmIAbFiqfw";

const Map = () => {
  const { setMap } = useContext(MapContext);
  const { setAnalysisData } = useContext(AnalysisContext);
  const { setPlot } = useContext(PlotContext);
  const [MouseCoordinate, setMouseCoordinate] = useState({
    long: "Not Set",
    lat: "Not Set",
  });

  useEffect(() => {
    // init globals
    window.runningAnalysis = false;
    if (!window.radiusKM) {
      window.radiusKM = 3;
    }

    // init map style
    let mapStyle = "mapbox://styles/bryce06/cl8fej02y001d14nvxe9qsb7c";

    if (localStorage.mapStyle) {
      mapStyle = localStorage.mapStyle;
    }

    if (!localStorage.user) {
      mapStyle = "mapbox://styles/mapbox/streets-v11";
    }

    const mapInstance = new mapboxgl.Map({
      container: document.getElementById("map"),
      center: [137.20058023553122, 36.59778523236276],
      style: mapStyle,
      zoom: 7.8,
      minZoom: 4,
      maxPitch: 45,
      maxBearing: -45,
    });
    mapInstance.addControl(new mapboxgl.NavigationControl());

    function runAreaAnalysis(coordinates) {
      if (window.onHazard) {
        errorToast(
          `This area is a ${onHazard} hazard zone. and is automatically disqualified.`,
          "top-center",
          5000
        );
        return false;
      }

      if (!window.runningAnalysis) {
        console.log(coordinates);

        setAnalysisData(null);

        // remove exisiting marker
        const renderDeltaMarker = () => {
          let markerInstances = document.querySelectorAll("#delta-cursor");
          markerInstances.forEach((m) => {
            m.remove();
          });

          let markerUI = `
        <div class="area-cursor-container" id="delta-cursor">
        <div class="area-cursor fade-in">
        <i class="la la-spinner spin" /></i>
        </div>
        </div>
        `;
          let popup = new mapboxgl.Popup();
          popup.setLngLat(coordinates);
          popup.setHTML(markerUI);
          popup.addTo(mapInstance);
        };

        renderDeltaMarker();

        window.runningAnalysis = true;
        axios
          .post("/api/analyze", {
            lat: coordinates.lat,
            lon: coordinates.lng,
            radius: window.radiusKM,
            weightSettings: window.layerSettings,
          })
          .then((res) => {
            console.log(res.data);

            renderDeltaMarker();

            map.flyTo({
              center: [coordinates.lng, coordinates.lat],
              essential: true,
              zoom: 16,
            });

            if (res.data.qualifiedArea) {
              document.querySelector("#delta-cursor").innerHTML = `
              <div class="area-cursor qualified fade-in">
              <i class="la la-check" /></i>
              </div>
              <div class="area-cursor-info fade-in-bottom">
              <small>
                <strong class="text-active">SELECTED AREA</strong>
              </small>
              <small>
                <strong>Area Status:</strong> ${
                  res.data.qualifiedArea ? "Qualified" : "Disqualified"
                }
              </small>
              <small>
                <strong>Radius:</strong> ${window.radiusKM} km
              </small>
              </div>
              `;
            } else {
              document.querySelector("#delta-cursor").innerHTML = `
              <div class="area-cursor disqualified fade-in">
              <i class="la la-close" /></i>
              </div>
              <div class="area-cursor-info fade-in-bottom">
              <small>
                <strong class="text-active">SELECTED AREA</strong>
              </small>
              <small>
                <strong>Area Status:</strong> ${
                  res.data.qualifiedArea ? "Qualified" : "Disqualified"
                }
              </small>
              <small>
                <strong>Radius:</strong> ${window.radiusKM} km
              </small>
              </div>
              `;
            }
            window.runningAnalysis = false;

            if (res.data.autoDisqualified) {
              errorToast(
                `The area you selected was automatically disqualified.`,
                "top-center"
              );
            }

            setAnalysisData(res.data);
          })
          .catch((err) => {
            console.log(err);
            document.querySelector("#delta-cursor").innerHTML = `
            <div class="area-cursor disqualified fade-in">
            <i class="la la-close" /></i>
            </div>
            `;
            window.runningAnalysis = false;
          });
      }
    }

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    mapInstance.on("load", () => {
      if (localStorage.user) {
        loadMapLayers(mapInstance);
        loadMapLegends(popup);
      }

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        // defaultMode: "none",
      });
      mapInstance.addControl(draw);

      window.mapDraw = draw;

      function updateArea(e) {
        const data = draw.getAll();
        if (data.features.length > 0) {
          const area = tfArea(data);
          const centroid = tfCentroid(data);
          // Restrict the area to 2 decimal points.
          const rounded_area = Math.round(area * 100) / 100;
          console.log("Area", rounded_area);
          console.log("Centroid", centroid);

          setPlot({
            lng: centroid.geometry.coordinates[0],
            lat: centroid.geometry.coordinates[1],
            area_size: rounded_area,
            plot_geojson: data,
          });
        } else {
          if (e.type !== "draw.delete")
            alert("Click the map to draw a polygon.");
        }
      }

      mapInstance.on("draw.create", updateArea);
      mapInstance.on("draw.delete", updateArea);
      mapInstance.on("draw.update", updateArea);
    });

    mapInstance.on("click", function (e) {
      if (localStorage.user) {
        setTimeout(() => {
          runAreaAnalysis(e.lngLat);
        }, 300);
      }

      var longForm = document.getElementById("longitude-form");
      var latForm = document.getElementById("latitude-form");

      if (longForm && latForm) {
        longForm.value = e.lngLat.lng;
        latForm.value = e.lngLat.lat;

        longForm.click();
        latForm.click();
      }
    });

    setMap(mapInstance);
    window.map = mapInstance;
    window.runAreaAnalysis = runAreaAnalysis;
    mapInstance.on("mousemove", (e) => {
      const coor = e.lngLat.wrap();
      setMouseCoordinate({ long: coor.lng, lat: coor.lat });
    });
  }, []);

  return (
    <>
      <div>
        <div id="map" />
        <Coordinate long={MouseCoordinate.long} lat={MouseCoordinate.lat} />
      </div>
    </>
  );
};

export default Map;
