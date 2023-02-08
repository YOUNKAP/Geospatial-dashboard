import AdminSidebar from "./AdminSidebar";
import AdminTopNav from "./AdminTopNav";
import AdminFooter from "./AdminFooter";
import axios from "axios";
import { useEffect, useState } from "react";

const ScoringEditorPage = () => {
  const [layers, setLayers] = useState([]);

  const loadLayers = () => {
    axios.get("/api/scoring-algo/get-layers").then((res) => {
      setLayers(res.data);
    });
  };

  useEffect(() => {
    loadLayers();
  }, []);

  return (
    <div>
      <AdminSidebar activeLink="Edit Scoring Algo" />
      <div className="main-content" id="panel">
        <AdminTopNav />
        <div
          className="header pb-4 d-flex align-items-center"
          style={{
            minHeight: "500px",
            backgroundImage:
              "url(https://images.pexels.com/photos/3435272/pexels-photo-3435272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <span className="mask bg-gradient-default opacity-8" />
          <div className="container-fluid d-flex align-items-center">
            <div className="row">
              <div className="col-lg-10 col-md-10">
                <h1 className="display-2 text-white">Edit Scoring Algorithm</h1>
                <p className="text-white mt-0 mb-2">
                  This page contains the different rules that directly affect
                  the live scoring of the dashboard.
                </p>

                <div className="banner-menu">
                  <button className="btn btn-primary">
                    <i className="la la-layer-group mr-2 text-active" />
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid mt--6">
          <div className="row">
            <div className="w-100">
              <div className="card px-0">
                <div className="card-body card-shadow table-card">
                  <div className="table-responsive">
                    <table className="table align-items-center table-flush">
                      <thead className="thead-light text-dark">
                        <tr>
                          <th scope="col" className="sort" data-sort="name">
                            Dataset Name
                          </th>
                          <th scope="col" className="sort" data-sort="budget">
                            Classification
                          </th>
                          <th scope="col" className="sort" data-sort="status">
                            <i className="la la-square text-danger" /> Risk
                            Weight
                          </th>
                          <th scope="col">
                            <i className="la la-square text-success" /> Benefit
                            Weight
                          </th>
                          <th scope="col">
                            <i className="la la-square text-danger" />{" "}
                            Disqualification Zone
                          </th>
                          <th scope="col">
                            <i className="la la-square text-success" />{" "}
                            Proximity bonus
                          </th>
                          <th scope="col">
                            <i className="la la-square text-danger" /> Proximity
                            penalty
                          </th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {layers.map((layer) => {
                          return (
                            <tr>
                              <th scope="row">
                                <div className="media align-items-center">
                                  <div className="media-body">
                                    <span className="name mb-0 text-sm text-capitalize">
                                      {layer.layer_name}
                                    </span>
                                  </div>
                                </div>
                              </th>
                              <td className="classification">
                                <input
                                  type="text"
                                  className="form-control table-input"
                                  placeholder="Classification"
                                  defaultValue={layer.classification}
                                />
                              </td>
                              <td>
                                <span className="status">
                                  <input
                                    type="number"
                                    className="form-control table-input"
                                    placeholder="Risk Weight"
                                    defaultValue={layer.riskWeight}
                                  />
                                </span>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control table-select"
                                  placeholder="Benefit Weight"
                                  defaultValue={layer.benefitWeight}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control table-input"
                                  placeholder="Disqualification Zone (km)"
                                  defaultValue={layer.disqualification_zone}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control table-input"
                                  placeholder="Proximity bonus (km)"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control table-input"
                                  placeholder="Proximity penalty (km)"
                                />
                              </td>
                              <td>
                                {layer.status === "enabled" && (
                                  <button className="btn btn-success btn-sm">
                                    <i className="la la-square" /> Enabled
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default ScoringEditorPage;
