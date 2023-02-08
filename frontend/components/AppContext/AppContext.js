import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

// create context
export const MapContext = React.createContext();
export const AnalysisContext = React.createContext();
export const BrokerContext = React.createContext();
export const UserContext = React.createContext();
export const PlotContext = React.createContext();

function AppContext(props) {
  const [map, setMap] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedArea, setSelectedArea] = useState([]);
  const [user, setUser] = useState(null);
  const [plot, setPlot] = useState(null);

  useEffect(() => {
    if (localStorage.user) {
      const currentUser = JSON.parse(localStorage.user);
      setUser(currentUser);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <MapContext.Provider value={{ map, setMap }}>
        <UserContext.Provider value={{ user, setUser }}>
          <AnalysisContext.Provider value={{ analysisData, setAnalysisData }}>
            <BrokerContext.Provider value={{ selectedArea, setSelectedArea }}>
              <PlotContext.Provider value={{ plot, setPlot }}>
                {props.children}
              </PlotContext.Provider>
            </BrokerContext.Provider>
          </AnalysisContext.Provider>
        </UserContext.Provider>
      </MapContext.Provider>
    </>
  );
}

export default AppContext;
