import axios from "axios";
import { useContext, useState } from "react";
import { MapContext } from "../AppContext/AppContext";

export default function SearchSidebar() {
  const { map } = useContext(MapContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const runSearch = (qrx) => {
    if (!window.runningSearch) {
      window.runningSearch = true;
      setSearching(true);
      axios
        .get(
          `https://nominatim.openstreetmap.org/search.php?q=${qrx}&polygon_geojson=1&format=jsonv2`
        )
        .then((res) => {
          setResults(res.data);
          window.runningSearch = false;
        })
        .catch((err) => {
          window.runningSearch = false;
          console.log("Search Error", err);
          setQuery("");
          setResults(null);
          setSearching(false);
        });
    }
  };

  const selectResult = (area) => {
    const lon = Number(area.lon);
    const lat = Number(area.lat);

    var longForm = document.getElementById("longitude-form");
    var latForm = document.getElementById("latitude-form");

      if(longForm && latForm){

    
        longForm.value = lon
        latForm.value = lat

        longForm.click()
        latForm.click()
      

      }
    map.flyTo({
      center: [lon, lat],
      essential: true,
      zoom: 12,
    });

    if (localStorage.user) {
      map.getSource("area-polygon").setData(area.geojson);
    }
  };

  const resetSearch = () => {
    setQuery("");
    setResults(null);
    if (localStorage.user) {
      map
        .getSource("area-polygon")
        .setData({ type: "FeatureCollection", features: [] });
    }
    setSearching(false);
  };

  return (
    <>
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search Places.."
          className="form-control"
          id="search-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("search");
              setQuery(e.target.value);
              runSearch(e.target.value);
            }
          }}
        />
        <button
          className={"btn btn-default search-button"}
          onClick={resetSearch}
        >
          <i
            className={`la ${query.trim() !== "" ? "la-close" : "la-search"}`}
          />
        </button>
      </div>

      {searching && (
        <>
          <div className="search-feed-wrapper fade-in-min">
            <div className="search-feed">
              <div className="feed text-center pt-4">
                <h3>
                  <i className="la la-spinner spin text-primary" /> Searching...
                </h3>
              </div>
            </div>
          </div>
        </>
      )}

      {query.trim() !== "" && results && (
        <div className="search-feed-wrapper fade-in-min">
          {query.trim() !== "" && results.length === 0 && (
            <div className="search-feed">
              <div className="feed text-center pt-4">
                <p>
                  <i className="la la-info" /> No results found.
                </p>
              </div>
            </div>
          )}
          <div className="search-feed">
            {results.map((result) => {
              return (
                <div
                  className="feed"
                  onClick={() => {
                    selectResult(result);
                  }}
                >
                  <h2>
                    <i className="la la-map text-primary" />{" "}
                    {result.display_name}
                  </h2>
                  <span>{result.type}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
