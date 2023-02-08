import { useContext, useEffect, useState } from "react";
import { MapContext } from "../AppContext/AppContext";
import SidebarSettings from "../SidebarSettings/SidebarSettings";
import { LayerSet } from "./LayerSet";
const dataList = [...LayerSet];

export default function MainTab() {
  const { map } = useContext(MapContext);
  const [hideBroker, setHideBroker] = useState(null);
  const [activeLayers, setActiveLayers] = useState(
    dataList.map((x) => x.layerID)
  );
  const [categories, setCategories] = useState({});
  const [activeCategories, setActiveCategories] = useState(["Hazards"]);

  useEffect(() => {
    if (window.activeLayers) {
      setActiveLayers(window.activeLayers);
    } else {
      window.activeLayers = activeLayers;
    }

    let LayerCategories = {};

    LayerSet.forEach((x) => {
      if (!LayerCategories[x.category]) {
        LayerCategories[x.category] = [x];
      } else {
        LayerCategories[x.category].push(x);
      }
    });

    setCategories(LayerCategories);
  }, []);

  const toggleSecondaryLayer = (layer) => {
    const visibility = map.getLayoutProperty(layer.layerID, "visibility");

    if (visibility === "visible") {
      map.setLayoutProperty(layer.layerID, "visibility", "none");
    } else {
      map.setLayoutProperty(layer.layerID, "visibility", "visible");
    }
  };

  const toggleLayer = (layer) => {
    const visibility = map.getLayoutProperty(layer.layerID, "visibility");

    if (visibility === "visible") {
      map.setLayoutProperty(layer.layerID, "visibility", "none");
      window.activeLayers = activeLayers.filter((x) => x !== layer.layerID);
    } else {
      map.setLayoutProperty(layer.layerID, "visibility", "visible");
      window.activeLayers = [...activeLayers, layer.layerID];
    }

    if (layer.layerID === "electrical-substations") {
      toggleSecondaryLayer({ layerID: "substation-icons" });
    }

    setActiveLayers(window.activeLayers);
  };

  const toggleCategory = (cat) => {
    if (activeCategories.includes(cat)) {
      setActiveCategories(activeCategories.filter((x) => x !== cat));
    } else {
      setActiveCategories([...activeCategories, cat]);
    }
  };

  return (
    <>
      <div className="main-tab">
        <span className="component-headline">
          <i className="la la-layer-group text-primary" /> Map Dataset Layers
        </span>

        <SidebarSettings />

        <div className="data-list">
          {Object.keys(categories).map((cat) => {
            return (
              <>
                <div
                  className={`category-dropdown ${
                    activeCategories.includes(cat) ? "active" : ""
                  }`}
                  onClick={() => {
                    toggleCategory(cat);
                  }}
                >
                  <span className="title">
                    <i className="la la-layer-group" /> {cat}
                  </span>

                  {activeCategories.includes(cat) && (
                    <i className="la la-angle-up text-info" />
                  )}

                  {!activeCategories.includes(cat) && (
                    <i className="la la-angle-down" />
                  )}
                </div>
                {activeCategories.includes(cat) &&
                  categories[cat].map((layer, index) => {
                    return (
                      <div
                        className={`data-item ${
                          activeLayers.includes(layer.layerID) ? "active" : ""
                        }`}
                        key={index}
                        onClick={() => {
                          toggleLayer(layer);
                        }}
                      >
                        <div className="d-flex">
                          <img src={layer.icon} />
                          <div className="data-info">
                            <div className="info-title">
                              <span className="headline">
                                {" "}
                                <b style={{ color: layer.iconColor }}>◩</b>{" "}
                                {layer.name}
                              </span>
                            </div>
                            <small>{layer.description}</small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
