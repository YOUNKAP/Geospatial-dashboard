export function loadMapLayers(map) {
  const mapInstance = map;
  // add area search layer
  mapInstance.addSource("area-polygon", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  mapInstance.addLayer({
    id: "area-fill",
    type: "fill",
    source: "area-polygon",
    layout: {
      visibility: "visible",
    },
    paint: {
      "fill-color": "#397591",
      "fill-opacity": 0.6,
    },
  });

  // bizareas layers
  // mapInstance.addSource("biz-polygon", {
  //   type: "geojson",
  //   // data: "/map-datasets/bizareas.geojson",
  //   data: "/map-datasets/bizareas.geojson",
  // });

  // mapInstance.addLayer({
  //   id: "biz-fill",
  //   type: "fill",
  //   source: "biz-polygon",
  //   layout: {
  //     visibility: "visible",
  //   },
  //   paint: {
  //     "fill-color": "blue",
  //     "fill-opacity": 0.3,
  //   },
  // });

  // flood layer
  // mapInstance.addSource("flood-polygon", {
  //   type: "geojson",
  //   data: "/map-datasets/flood.geojson",
  // });

  // mapInstance.addLayer({
  //   id: "flood-fill",
  //   type: "fill",
  //   source: "flood-polygon",
  //   layout: {
  //     visibility: "visible",
  //   },
  //   paint: {
  //     "fill-color": "indigo",
  //     "fill-opacity": 0.5,
  //   },
  // });

  //tsunami
  // mapInstance.addSource("tsunami-polygon", {
  //   type: "geojson",
  //   data: "/map-datasets/tsunami.geojson",
  // });

  // mapInstance.addLayer({
  //   id: "tsunami-fill",
  //   type: "fill",
  //   source: "tsunami-polygon",
  //   layout: {
  //     visibility: "visible",
  //   },
  //   paint: {
  //     "fill-color": "red",
  //     "fill-opacity": 0.5,
  //   },
  // });

  // tides
  // mapInstance.addSource("tides-polygon", {
  //   type: "geojson",
  //   data: "/map-datasets/tides.geojson",
  // });

  // mapInstance.addLayer({
  //   id: "tides-fill",
  //   type: "fill",
  //   source: "tides-polygon",
  //   layout: {
  //     visibility: "visible",
  //   },
  //   paint: {
  //     "fill-color": "yellow",
  //     "fill-opacity": 0.3,
  //   },
  // });

  // mapInstance.addSource("landuse-polygon", {
  //   type: "geojson",
  //   data: "/map-datasets/land_use.geojson",
  // });

  // mapInstance.addLayer({
  //   id: "landuse-fill",
  //   type: "fill",
  //   source: "landuse-polygon",
  //   layout: {
  //     visibility: "visible",
  //   },
  //   paint: {
  //     "fill-color": "teal",
  //     "fill-opacity": 0.3,
  //   },
  // });

  // mapInstance.addSource("sedimenthc-polygon", {
  //   type: "geojson",
  //   data: "/map-datasets/sediment_housecollapse.geojson",
  // });

  // mapInstance.addLayer({
  //   id: "sedimenthc-fill",
  //   type: "fill",
  //   source: "sedimenthc-polygon",
  //   layout: {
  //     visibility: "visible",
  //   },
  //   paint: {
  //     "fill-color": "brown",
  //     "fill-opacity": 0.3,
  //   },
  // });

  // seismic
  // mapInstance.addSource("seismic-polygon", {
  //   type: "geojson",
  //   data: "/map-datasets/seismic.geojson",
  // });

  // mapInstance.addLayer({
  //   id: "seismic-fill",
  //   type: "fill",
  //   source: "seismic-polygon",
  //   layout: {
  //     visibility: "visible",
  //   },
  //   paint: {
  //     "fill-color": "red",
  //     "fill-opacity": 0.2,
  //   },
  // });

  // fault line
  // mapInstance.addSource("fault-line", {
  //   type: "geojson",
  //   data: "/map-datasets/faults.geojson",
  // });

  // mapInstance.addLayer({
  //   id: "fault-lines",
  //   type: "line",
  //   source: "fault-line",
  //   layout: {
  //     "line-join": "round",
  //     "line-cap": "round",
  //   },
  //   paint: {
  //     "line-color": "red",
  //     "line-width": 2,
  //   },
  // });

  // add heatmap layer
  map.addSource("volcano", {
    type: "geojson",
    data: "/map-datasets/volcanoes.json",
  });

  map.addLayer(
    {
      id: "volcano-heat",
      type: "heatmap",
      source: "volcano",
      maxzoom: 15,
      paint: {
        "heatmap-weight": 1,
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 1, 2, 9, 4],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0.1,
          "rgba(33,102,172,0)",
          0.2,
          "rgb(103,169,207)",
          0.4,
          "rgb(209,229,240)",
          0.6,
          "rgb(253,219,199)",
          0.8,
          "rgb(239,138,98)",
          1,
          "rgb(178,24,43)",
        ],
        // Adjust the heatmap radius by zoom level
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 1, 2, 9, 20],
        // Transition from heatmap to circle layer by zoom level
        "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 2],
      },
    },
    "waterway-label"
  );

  // transmission lines
  map.addSource("tr-lines", {
    type: "geojson",
    data: "/map-datasets/transmission_lines.geojson",
  });

  map.addLayer({
    id: "transmission-lines",
    type: "circle",
    source: "tr-lines",
    paint: {
      "circle-color": "blue",
      "circle-radius": 2,
      "circle-opacity": 0.5,
    },
  });

  //submarine landing
  map.addSource("submarine-landing", {
    type: "geojson",
    data: "/map-datasets/submarine_landing.geojson",
  });

  //  substations
  map.addSource("elec-stations", {
    type: "geojson",
    data: "/map-datasets/electrical_substations.geojson",
  });

  map.addLayer({
    id: "electrical-substations",
    type: "circle",
    source: "elec-stations",
    paint: {
      "circle-color": "#21E2C2",
      "circle-radius": 5,
      "circle-opacity": 1,
    },
  });

  // nuclear powerplant source
  map.addSource("nuclear-powerplant-source", {
    type: "geojson",
    data: "/map-datasets/nuclear_powerplant.geojson",
  });

  map.loadImage("/images/substation.png", (error, image) => {
    if (error) throw error;
    map.addImage("custom-marker", image);

    // Add a symbol layer
    map.addLayer({
      id: "substation-icons",
      type: "symbol",
      source: "elec-stations",
      layout: {
        "icon-image": "custom-marker",
        "icon-size": 0.25,
      },
    });

    map.loadImage("/images/subc.png", (error, image) => {
      if (error) throw error;
      map.addImage("subc-marker", image);

      map.addLayer({
        id: "submarine-landing-icons",
        type: "symbol",
        source: "submarine-landing",
        layout: {
          "icon-image": "subc-marker",
          "icon-size": 0.18,
        },
      });
    });

    map.loadImage("/images/radioactive.png", (error, image) => {
      if (error) throw error;
      map.addImage("nuclear-marker", image);

      map.addLayer({
        id: "nuclear-powerplant",
        type: "symbol",
        source: "nuclear-powerplant-source",
        layout: {
          "icon-image": "nuclear-marker",
          "icon-size": 0.18,
        },
      });
    });
  });

  // oil refineries
  map.addSource("oil-refineries-source", {
    type: "geojson",
    data: "/map-datasets/oil_refineries.geojson",
  });

  map.loadImage("/images/oil-refineries.png", (error, image) => {
    if (error) throw error;
    map.addImage("oil-ref-marker", image);

    map.addLayer({
      id: "oil-refineries",
      type: "symbol",
      source: "oil-refineries-source",
      layout: {
        "icon-image": "oil-ref-marker",
        "icon-size": 0.2,
      },
    });
  });

  // military bases
  map.addSource("militaryb-source", {
    type: "geojson",
    data: "/map-datasets/military_bases.geojson",
  });

  map.loadImage("/images/military-bases.png", (error, image) => {
    if (error) throw error;
    map.addImage("militaryb-marker", image);

    map.addLayer({
      id: "military-bases",
      type: "symbol",
      source: "militaryb-source",
      layout: {
        "icon-image": "militaryb-marker",
        "icon-size": 0.2,
      },
    });
  });

  // end of map layers
}
