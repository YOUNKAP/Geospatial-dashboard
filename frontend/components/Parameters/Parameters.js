import { useState, useEffect, useContext } from "react";
import { MapContext } from "../AppContext/AppContext";

export default function Parameters() {
  const [latitudeValidation, setLatitudeValidation] = useState(1);
  const [longitudeValidation, setLongitudeValidation] = useState(1);
  const [distanceValidation, setDistanceValidation] = useState(0);
  const [error, setError] = useState({
    latitudeError: null,
    longitudeError: null,
    distanceError: null,
  });
  const [enableButton, setEnableButton] = useState("disabled");

  const [minLat, maxLat, minLon, maxLon, minDis, maxDis] = [
    20.3, 49.9, 120, 150, 1, 25,
  ];

  const { map } = useContext(MapContext);

  const goToCoordinate = () => {
    var lon = parseFloat(document.getElementById("longitude-form").value);
    var lat = parseFloat(document.getElementById("latitude-form").value);
    console.log(lon, lat);

    map.flyTo({
      center: [lon, lat],
      essential: true,
      zoom: 12,
    });

    window.runAreaAnalysis({ lng: lon, lat: lat });
  };

  const formValidate = (e, tipe) => {
    var value = e.target.value;
    if (tipe == "latitude") {
      if (value < minLat) {
        setLatitudeValidation(1);
        setError({
          ...error,
          latitudeError: `Latitude should not under ${minLat}`,
        });
      } else if (value > maxLat) {
        setLatitudeValidation(1);
        setError({
          ...error,
          latitudeError: `Latitude should not above ${maxLat}`,
        });
      } else {
        setLatitudeValidation(0);
        setError({ ...error, latitudeError: null });
      }
    } else if (tipe == "longitude") {
      if (value < minLon) {
        setLongitudeValidation(1);
        setError({
          ...error,
          longitudeError: `Longitude should not under ${minLon}`,
        });
      } else if (value > maxLon) {
        setLongitudeValidation(1);
        setError({
          ...error,
          longitudeError: `Longitude should not above ${maxLon}`,
        });
      } else {
        setLongitudeValidation(0);
        setError({ ...error, longitudeError: null });
      }
    } else if (tipe == "distance") {
      window.radiusKM = value;
      if (value < minDis) {
        setDistanceValidation(1);
        setError({
          ...error,
          distanceError: `Distance should not under ${minDis}`,
        });
      } else if (value > maxLat) {
        setDistanceValidation(1);
        setError({
          ...error,
          distanceError: `Distance should not above ${maxDis}`,
        });
      } else {
        setDistanceValidation(0);
        setError({ ...error, distanceError: null });
      }
    }
  };

  const setButtonDisable = () => {
    if (
      latitudeValidation === 1 ||
      longitudeValidation === 1 ||
      distanceValidation === 1
    ) {
      setEnableButton("disabled");
    } else if (
      latitudeValidation === 0 &&
      longitudeValidation === 0 &&
      distanceValidation === 0
    ) {
      setEnableButton("enabled");
    }
  };

  useEffect(() => {
    setButtonDisable();
  });

  return (
    <>
      <span className="component-headline">
        <i className="la la-map-marker text-primary" /> Input Coordinates &
        Radius
      </span>
      <div className="input-card mt-2">
        <div id="latitude">
          <h3>Latitude</h3>
        </div>

        <input
          className="form-control form-control-md"
          id="latitude-form"
          type="number"
          onChange={(e) => formValidate(e, "latitude")}
        />
        <div className="error-value">
          {latitudeValidation === 1 ? error.latitudeError : null}
        </div>

        <h3>Longitude</h3>
        <input
          className="form-control form-control-md"
          id="longitude-form"
          type="number"
          onChange={(e) => formValidate(e, "longitude")}
        />
        <div className="error-value">
          {longitudeValidation === 1 ? error.longitudeError : null}
        </div>

        <h3>Maximum Radius (km)</h3>
        <input
          className="form-control form-control-md"
          id="distance-form"
          type="number"
          defaultValue={window.radiusKM ? window.radiusKM : "1"}
          onChange={(e) => formValidate(e, "distance")}
        />
        <div className="error-value">
          {distanceValidation === 1 ? error.distanceError : null}
        </div>

        <button
          className={`btn btn-default mt-3 ${enableButton}`}
          onClick={goToCoordinate}
        >
          <i className="la la-braille mr-2"></i>
          Apply Input
        </button>
      </div>
    </>
  );
}
