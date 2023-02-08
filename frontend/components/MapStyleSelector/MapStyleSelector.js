import { useContext, useEffect, useState } from "react";
import { MapContext } from "../AppContext/AppContext";

const MapStyleSelector = () => {
  const { map } = useContext(MapContext);

  const styleSet = [
    {
      name: "dark",
      pointColor: "#59ffde",
      mapStyle:
        "https://raw.githubusercontent.com/jingsam/mapbox-gl-styles/master/Moves-map.json",
    },
    {
      name: "main",
      pointColor: "#366de3",
      mapStyle: "mapbox://styles/bryce06/cl8fej02y001d14nvxe9qsb7c",
    },
    {
      name: "street",
      pointColor: "#366de3",
      mapStyle: "mapbox://styles/mapbox/streets-v11",
    },
    {
      name: "satellite",
      pointColor: "#59ffde",
      mapStyle: "mapbox://styles/mapbox/satellite-streets-v10",
    },
  ];

  const [mapMode, setMode] = useState("");

  useEffect(() => {
    if (localStorage.mapMode) {
      setMode(localStorage.mapMode);
    } else {
      setMode("main");
    }
  }, []);

  return (
    <>
      <span className="component-headline">
        <i className="la la-map text-primary" /> Change map theme
      </span>
      <small>Click to change the base theme of the map.</small>
      <div className="map-styles mb-3 fade-in">
        {styleSet.map((x, index) => {
          return (
            <div
              className={`map-style ${x.name} ${
                mapMode === x.name ? "active-mode" : ""
              }`}
              key={index}
              onClick={() => {
                localStorage.mapStyle = x.mapStyle;
                localStorage.pointColor = x.pointColor;
                localStorage.mapMode = x.name;
                setMode(x.name);
                map.setStyle(x.mapStyle);
                window.location.reload();
              }}
            >
              <span>{x.name}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MapStyleSelector;
