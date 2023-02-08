import { useEffect, useState } from "react";
import { layersWeights } from "../../utilities/layerWeights";
import { errorToast, exportScoreSettings, successToast } from "../Util";

const SidebarSettings = () => {
  const [layerItems, setLayerItems] = useState([...layersWeights]);
  const [showTab, setShowTab] = useState(false);
  const [customized, setCustomized] = useState(false);

  const toggleSettings = () => {
    setShowTab(!showTab);
  };

  useEffect(() => {
    if (localStorage.customScores) {
      let customScores = JSON.parse(localStorage.customScores);
      setLayerItems(customScores);
      window.layerSettings = customScores;
      setCustomized(true);
    } else {
      window.layerSettings = layersWeights;
    }
  }, [customized]);

  const updateValues = (e, lx) => {
    const value = e.target.value;
    const inputType = e.target.id;
    let layers = [...layerItems];

    let updatedItem = { ...lx };
    let targetIndex = layers.findIndex((x) => x.name === lx.name);

    console.log(targetIndex);

    if (inputType === "risk-w") {
      updatedItem = { ...lx, riskWeight: Number(value) };
    }

    if (inputType === "benefit-w") {
      updatedItem = { ...lx, benefitWeight: Number(value) };
    }

    layers.forEach((item) => {
      if (
        item.riskWeight > 10 ||
        item.benefitWeight > 10 ||
        item.riskWeight < 0 ||
        item.benefitWeight < 0
      ) {
        item.status = "invalid";
      } else {
        item.status = "";
      }

      if (item.riskWeight === 0 && item.benefitWeight === 0) {
        item.status = "skipped";
      }

      layers[targetIndex] = updatedItem;
      setLayerItems(layers);
    });

    layers[targetIndex] = updatedItem;

    setLayerItems(layers);
  };

  const applyScores = (layers) => {
    let layerSettings = [...layers];

    let InvalidScores = layerSettings.filter(
      (item) =>
        item.riskWeight > 10 ||
        item.benefitWeight > 10 ||
        item.riskWeight < 0 ||
        item.benefitWeight < 0
    );

    if (InvalidScores.length !== 0) {
      errorToast("Scores should be at 1-10 range.");
      return false;
    }

    successToast("Changes are saved!");
    window.layerSettings = layerSettings;
    localStorage.customScores = JSON.stringify(layerSettings);
    setCustomized(true);
  };

  const loadImportfile = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;

      try {
        let data = JSON.parse(text);
        applyScores(data);
        toggleSettings();
        successToast("Successful Import!");
      } catch (error) {
        console.log(error);
        errorToast("Invalid imported file!");
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const startImport = () => {
    document.getElementById("import-file").click();
  };

  const restoreScoreDefaults = () => {
    localStorage.removeItem("customScores");
    window.layerSettings = [...layersWeights];
    setLayerItems([...layersWeights]);
    successToast("Restored scores to default!");
    setCustomized(false);
    toggleSettings();
  };

  return (
    <>
      <button
        className={`btn ${
          customized ? "btn-primary" : "btn-default"
        } my-2 mr-0`}
        onClick={toggleSettings}
      >
        <i className="la la-sliders-h text-info" /> Score Settings (
        {customized ? "Customized" : "Default"})
      </button>

      <input
        id="import-file"
        className="d-none"
        type="file"
        onChange={(e) => {
          loadImportfile(e);
        }}
      />

      <>
        {showTab && (
          <div className="sidebar slide-in-left">
            <div className="sidebar-header">
              <div className="settings-title">
                <span>
                  <i className="la la-sliders-h" /> Settings
                </span>
                <button
                  className="btn btn-default btn-sm"
                  onClick={toggleSettings}
                >
                  <i className="la la-close" />
                </button>
              </div>
            </div>
            <div className="sidebar-container">
              <span className="component-headline">
                <i className="la la-layer-group text-primary" /> Modify Layer
                Scores
              </span>

              <span>
                <i className="la la-info text-primary" /> Apply scores at the
                scale of 1-10 for each dataset layer.
              </span>

              {layerItems.map((layer) => {
                return (
                  <div
                    className={`score-block ${
                      layer.benefitWeight > layer.riskWeight
                        ? "benefit"
                        : "risk"
                    }
                    ${layer.status ? layer.status : ""}
                    `}
                  >
                    <span className="title">
                      <i className="la la-cube text-primary" />{" "}
                      {layer.name.replace("_", " ")} {}
                    </span>

                    <div className="input-set">
                      <div className="weight-block">
                        <small>
                          <i className="la la-square text-success" /> Benefit
                        </small>
                        <input
                          defaultValue={layer.benefitWeight}
                          className="form-control"
                          placeholder="Benefit Weight"
                          type="number"
                          id="benefit-w"
                          onKeyUp={(e) => {
                            updateValues(e, layer);
                          }}
                          min="0"
                          max="10"
                        />
                      </div>
                      <div className="weight-block">
                        <small>
                          <i className="la la-square text-red" /> Risk
                        </small>
                        <input
                          defaultValue={layer.riskWeight}
                          className="form-control"
                          placeholder="Risk Weight"
                          type="number"
                          id="risk-w"
                          onKeyUp={(e) => {
                            updateValues(e, layer);
                          }}
                          min="0"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="button-set">
                <button className="btn btn-default" onClick={startImport}>
                  <i className="la la-upload text-info" /> Import
                </button>
                <button
                  className="btn btn-default"
                  onClick={exportScoreSettings}
                >
                  <i className="la la-download text-info" /> Export
                </button>
              </div>
              {customized && (
                <button
                  className="btn btn-default"
                  onClick={restoreScoreDefaults}
                >
                  <i className="la la-refresh text-success" /> Restore Defaults
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => {
                  applyScores(layerItems);
                }}
              >
                <i className="la la-braille text-success" /> Apply Settings
              </button>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default SidebarSettings;
