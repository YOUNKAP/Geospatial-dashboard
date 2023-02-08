import { LayerSet } from "../MainTab/LayerSet";

export const loadMapLegends = (popup) => {
  const mapInstance = window.map;

  const visibleLayers = LayerSet.filter((x) => x.legend);

  visibleLayers.forEach((layer) => {
    mapInstance.on("mouseenter", layer.layerID, (e) => {
      map.getCanvas().style.cursor = "pointer";

      const description = `
            <div class="map-legend fade-in-bottom dl-1">
              <small><b style="color:${layer.iconColor}">◩</b> ${layer.legend}</small>
            </div>
            `;

      popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
    });

    mapInstance.on("mouseleave", layer.layerID, () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
      window.onHazard = null;
    });
  });

  const hazardLayers = LayerSet.filter((x) => x.hazardZone);

  hazardLayers.forEach((layer) => {
    mapInstance.on("click", layer.layerID, () => {
      window.onHazard = layer.name;
    });
  });
};
