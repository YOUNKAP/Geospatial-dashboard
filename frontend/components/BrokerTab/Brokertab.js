import { useState, useEffect, useContext } from "react";
import { BrokerContext, PlotContext } from "../AppContext/AppContext";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import swal from "sweetalert2";
import { MapContext } from "../AppContext/AppContext";
import { layersWeights } from "../../utilities/layerWeights";

export default function BrokerTabs() {
  const { plot } = useContext(PlotContext);

  const [dbBroker, setDBBroker] = useState(null);
  const [dbIndexPopUp, setIndexDBPopUp] = useState(null);

  const [clickedCoor, setClickedCoor] = useState({
    lat: null,
    lon: null,
  });
  const [brokerPopup, setBrokerPoopup] = useState(null);
  const { selectedArea, setSelectedArea } = useContext(BrokerContext);

  const [latitudeValidation, setLatitudeValidation] = useState(1);
  const [longitudeValidation, setLongitudeValidation] = useState(1);
  const [areaValidation, setAreaValidation] = useState(0);
  const [priceValidation, setPriceValidation] = useState(1);
  const [companyValidation, setCompanyValidation] = useState(1);
  const [emailValidation, setEmailValidation] = useState(1);
  const [error, setError] = useState({
    latitudeError: null,
    longitudeError: null,
    areaError: null,
    priceError: null,
    companyError: null,
    emailError: null,
  });
  const [mainError, setMainError] = useState("");
  const [enableButton, setEnableButton] = useState("disabled");

  const [minLat, maxLat, minLon, maxLon, minDis, maxDis] = [
    20.3, 49.9, 120, 150, 1, 25,
  ];

  const { map } = useContext(MapContext);

  const formValidate = (e, tipe) => {
    var value = e.target.value;
    e.preventDefault();
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
    } else if (tipe == "area") {
      window.radiusKM = value;
      if (value < minDis) {
        setAreaValidation(1);
        setError({
          ...error,
          areaError: `Area should not under ${minDis}`,
        });
      } else {
        setAreaValidation(0);
        setError({ ...error, areaError: null });
      }
    } else if (tipe == "price") {
      if (value == "") {
        setPriceValidation(1);
        setError({
          ...error,
          priceError: `Price should not empty`,
        });
      } else if (value < 0) {
        setPriceValidation(1);
        setError({
          ...error,
          priceError: `Price should not negative`,
        });
      } else {
        setPriceValidation(0);
        setError({ ...error, priceError: null });
      }
    } else if (tipe == "company") {
      if (value == "") {
        setCompanyValidation(1);
        setError({
          ...error,
          companyError: `Company name should not empty`,
        });
      } else {
        setCompanyValidation(0);
        setError({ ...error, companyError: null });
      }
    } else if (tipe == "email") {
      if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        setEmailValidation(1);
        setError({
          ...error,
          emailError: `Incorrect email format.`,
        });
      } else {
        setEmailValidation(0);
        setError({ ...error, emailError: null });
      }
    }
  };

  const setButtonDisable = () => {
    let incompleteFields = 0;

    if (
      latitudeValidation === 1 ||
      longitudeValidation === 1 ||
      areaValidation === 1 ||
      priceValidation === 1 ||
      companyValidation === 1 ||
      emailValidation === 1
    ) {
      incompleteFields++;
    }

    if (
      latitudeValidation === 0 &&
      longitudeValidation === 0 &&
      areaValidation === 0 &&
      priceValidation === 0 &&
      companyValidation === 0 &&
      emailValidation === 0
    ) {
      incompleteFields = 0;
    }

    document.querySelectorAll(".form-item").forEach((input) => {
      if (input.value.trim() === "") {
        incompleteFields++;
      }
    });

    if (incompleteFields !== 0) {
      setMainError("Please complete all the fields to proceed.");
      setEnableButton("disabled");
    } else {
      setMainError("");
      setEnableButton("enabled");
    }
  };

  const createMarker = (long, lat) => {
    const marker = new mapboxgl.Marker({}).setLngLat([long, lat]).addTo(map);

    return marker;
  };
  const addLocation = (e) => {
    if (e.target.className.includes("disabled")) {
      return;
    }

    fetchDrawnPlot();

    var lat = document.getElementById("latitude-form").value;
    var long = document.getElementById("longitude-form").value;
    var area = document.getElementById("area-form").value;
    var price = document.getElementById("price-form").value;
    var company = document.getElementById("company-form").value;
    var email = document.getElementById("email-form").value;
    var marker = createMarker(long, lat);
    var brokerName = document.getElementById("broker-name").value;
    var brokerID = document.getElementById("broker-id").value;
    setClickedCoor({ ...clickedCoor, lat: lat, lon: long });
    map.flyTo({ center: [long, lat] });

    var el = marker.getElement();
    el.id = "marker";

    el.addEventListener("mouseenter", () => setBrokerPoopup(marker));
    el.addEventListener("mouseleave", () => setBrokerPoopup(null));

    swal.fire({
      icon: "info",
      title: "Processing Request..",
      text: "Please don't close the page as we are processing your request. This will take a few moments..",
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    swal.showLoading();

    axios
      .post("/api/analyze", {
        lat: lat,
        lon: long,
        radius: 3,
        weightSettings: layersWeights,
      })
      .then((res) => {
        axios
          .get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&polygon_geojson=1&format=jsonv2`
          )
          .then((res2) => {
            if (res2.data.length == 0) {
              swal.fire({
                icon: "error",
                title: "Place not found.",
                text: "Sorry we can't find the name of the area you selected.",
              });
              return false;
            }

            swal.fire({
              icon: "success",
              title: "Done!",
              text: "Your location was selected successfully. You can select another plot of land or submit your selection to APL.",
            });

            const newLocation = {
              Longitude: long,
              Latitude: lat,
              Email: email,
              BrokerName: brokerName,
              BrokerID: brokerID,
              Price: price,
              Area: area,
              Company: company,
              Marker: marker,
              Name: res2.data.display_name,
              analysis: res.data,
              plot_geojson: plot.plot_geojson ? plot.plot_geojson : null,
            };

            console.log(newLocation);

            setSelectedArea((current) => [newLocation, ...current]);
          })
          .catch((err) => {
            swal.fire({
              icon: "error",
              title: "Error!",
              text: "An error occurred. Name of the selected location could not be retrieved.",
            });
          });

        // save location data
      })
      .catch((err) => {
        console.log(err);
        swal.fire({
          icon: "error",
          title: "Error!",
          text: "An error occurred. Please try again later.",
        });
      });
  };

  const showPopUp = () => {
    if (brokerPopup) {
      var indexMarker = selectedArea
        .map((obj) => obj.Marker)
        .indexOf(brokerPopup);

      if (indexMarker == -1) {
        indexMarker = dbIndexPopUp;

        var card = `<div class="broker-popup">
            <h1 >${dbBroker[indexMarker].Name}</h1>
            <div class="detail-broker">
              <p><i class="la la-square text-success"></i> Price: $${dbBroker[indexMarker].Price}</p>
            </div>
            <div class="detail-broker">
              <p><i class="la la-square text-primary"></i> Company: ${dbBroker[indexMarker].Company}</p>
            </div>
          </div>`;
      } else {
        var card = `<div class="broker-popup">
          <h1 >${selectedArea[indexMarker].Name}</h1>
          <div class="detail-broker">
            <p><i class="la la-square text-success"></i> Price: $${selectedArea[indexMarker].Price}</p>
          </div>
          <div class="detail-broker">
            <p><i class="la la-square text-primary"></i> Company: ${selectedArea[indexMarker].Company}</p>
          </div>
        </div>`;
      }

      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnMove: true,
      }).setHTML(card);

      brokerPopup.setPopup(popup);

      popup.addTo(map);
    } else {
      var popup = document.querySelectorAll(".mapboxgl-popup-content");

      popup.forEach((box) => {
        box.remove();
      });
    }
  };
  const createUI = (place, id) => {
    var n = new Date();
    var y = n.getFullYear();
    var m = n.getMonth() + 1;
    var d = n.getDate();

    return (
      <div
        className="selected-point broker-card"
        id={`broker-card-` + id}
        key={id}
        onClick={() => {
          addDetail(id - 1);
        }}
      >
        <div
          className="name-point-container"
          onClick={() => {
            addDetail(id - 1);
          }}
        >
          <h2>{place}</h2>
          <i className="la la-close" onClick={() => deleteCard(id - 1)}></i>
        </div>
        <span>
          <i className="la la-calendar text-primary"></i>{" "}
          {m + "/" + d + "/" + y}
        </span>
        <span className="marker-tag">
          <i className="la la-square text-success" /> Selected Area
        </span>
      </div>
    );
  };

  const deleteCard = (id) => {
    let filtered = selectedArea.filter((obj, index) => {
      return index !== id;
    });
    selectedArea[id].Marker.remove();
    setSelectedArea(filtered);
  };
  const createCard = () => {
    let UIS = [];

    selectedArea.map((item, index) => {
      if (item.Name !== null) {
        UIS.push(createUI(item.Name, index + 1));
      }
    });

    return <div>{UIS}</div>;
  };

  const addDetail = (id) => {
    map.flyTo({
      center: [selectedArea[id].Longitude, selectedArea[id].Latitude],
    });
  };

  const SavetoDB = () => {
    let filtered = selectedArea.map(({ Marker, ...rest }) => {
      var n = new Date();
      var y = n.getFullYear();
      var m = n.getMonth() + 1;
      var d = n.getDate();
      rest.Date = m + "/" + d + "/" + y;
      return rest;
    });

    swal.fire({
      icon: "info",
      title: "Submitting plots..",
      text: "Please wait, this might take a few moments..",
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    swal.showLoading();

    axios
      .post("/api/storebroker", filtered)
      .then((res) => {
        swal.fire({
          icon: "success",
          title: "Thank you for submitting!",
          text: "We have successfully received your submission.",
        });

        // clear selected locations
        for (let i = 0; i < selectedArea.length; i++) {
          deleteCard(i);
        }

        setSelectedArea([]);
      })
      .catch((error) => {
        console.log(error);
        swal.fire({
          icon: "error",
          title: "Submission failed!",
          text: "There was a problem with your submission.",
        });
      });
  };

  useEffect(() => {
    setButtonDisable();
  });

  useEffect(() => {
    showPopUp();
  }, [brokerPopup]);

  // automatically set items upon plotting

  const fetchDrawnPlot = () => {
    if (plot) {
      document.querySelector("#longitude-form").value = plot.lng;
      document.querySelector("#latitude-form").value = plot.lat;
      document.querySelector("#area-form").value = plot.area_size;
    }
  };

  useEffect(() => {
    fetchDrawnPlot();
  }, [plot]);

  return (
    <>
      <span className="component-headline">
        <i className="la la-map-marker text-primary" /> Input Your Locations
      </span>

      <div className="input-card mt-2">
        <div>
          <h3>
            <i className="la la-user text-primary" /> Name
          </h3>
        </div>

        <input
          className="form-control form-control-md form-item"
          id="broker-name"
          type="text"
          onChange={(e) => {
            console.log(e.target.value);
          }}
        />

        <div>
          <h3>
            <i className="la la-id-card text-primary" /> Broker ID
          </h3>
        </div>

        <input
          className="form-control form-control-md form-item"
          id="broker-id"
          type="text"
          onChange={(e) => {
            console.log(e.target.value);
          }}
        />

        <div id="latitude">
          <h3>
            <i className="la la-map-marker text-primary" /> Latitude
          </h3>
        </div>

        <input
          className="form-control form-control-md form-item"
          id="latitude-form"
          type="number"
          onChange={(e) => formValidate(e, "latitude")}
          onClick={(e) => formValidate(e, "latitude")}
        />
        <div className="error-value">
          {latitudeValidation === 1 ? error.latitudeError : null}
        </div>

        <h3>
          <i className="la la-map-marker text-primary" /> Longitude
        </h3>
        <input
          className="form-control form-control-md form-item"
          id="longitude-form"
          type="number"
          onChange={(e) => formValidate(e, "longitude")}
          onClick={(e) => formValidate(e, "longitude")}
        />
        <div className="error-value">
          {longitudeValidation === 1 ? error.longitudeError : null}
        </div>

        <h3>
          <i className="la la-vector-square text-primary " /> Size of Plot (sqm)
        </h3>
        <input
          className="form-control form-control-md form-item"
          id="area-form"
          type="number"
          onChange={(e) => formValidate(e, "area")}
        />
        <div className="error-value">
          {areaValidation === 1 ? error.areaError : null}
        </div>

        <h3>
          <i className="la la-square text-success" /> Price
        </h3>
        <input
          className="form-control form-control-md form-item"
          id="price-form"
          type="number"
          onChange={(e) => formValidate(e, "price")}
        />
        <div className="error-value">
          {priceValidation === 1 ? error.priceError : null}
        </div>

        <h3>
          <i className="la la-square text-primary" /> Company Name{" "}
        </h3>
        <input
          className="form-control form-control-md form-item"
          id="company-form"
          type="text"
          onChange={(e) => formValidate(e, "company")}
        />

        <div className="error-value">
          {companyValidation === 1 ? error.companyError : null}
        </div>

        <h3>
          <i className="la la-square text-info" /> Email Contact{" "}
        </h3>
        <input
          className="form-control form-control-md form-item"
          id="email-form"
          type="email"
          onChange={(e) => formValidate(e, "email")}
        />

        <div className="error-value">
          {emailValidation === 1 ? error.emailError : null}
        </div>

        <button
          className={`btn btn-default mt-3 ${enableButton}`}
          onClick={(event) => addLocation(event)}
        >
          <i className="la la-map-marker mr-2 text-info"></i>
          Select Location
        </button>
        <div className="error-value">{mainError}</div>
      </div>

      <div className="selected-location">
        <span className="component-headline">
          <i className="la la-map-marker text-primary" /> Selected Locations
        </span>

        <div className="selected-plots">{createCard()}</div>

        {selectedArea.length > 0 && (
          <button
            className={`btn btn-success mt-3 text-dark`}
            onClick={() => SavetoDB()}
            title="This will submit your proposed land plots to APL"
          >
            Submit Plots
            <i className="la la-send ml-2"></i>
          </button>
        )}
      </div>
    </>
  );
}
