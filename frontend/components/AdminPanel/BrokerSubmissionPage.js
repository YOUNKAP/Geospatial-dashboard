import AdminSidebar from "./AdminSidebar";
import AdminTopNav from "./AdminTopNav";
import AdminFooter from "./AdminFooter";
import { useEffect, useState } from "react";
import axios from "axios";
import { convertToCSV, errorToast, exportFile, loadingToast } from "../Util";
import moment from "moment";
import Nprogress from "nprogress";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const BrokerSubmissionsPage = () => {
  const [data, setData] = useState([]);

  const loadBrokersData = () => {
    Nprogress.start();
    axios
      .get("/api/storebroker")
      .then((res) => {
        let brokerData = res.data;
        setData(brokerData);
        Nprogress.done();
      })
      .catch((error) => {
        console.log(error);
        errorToast("Failed to load Brokers data!", "top-center");
        Nprogress.done();
      });
  };

  const searchData = (e) => {
    if (e.target.value === "") {
      loadBrokersData();
      return false;
    }

    loadingToast(`Searching Broker's data for: ${e.target.value}`);
    axios(`/api/storebroker?search=${e.target.value}`).then((res) => {
      if (res.data.length === 0) {
        errorToast("No results found.", "top-center");
        toast.dismiss("loading-toast");
        return false;
      }

      setData(res.data);
      toast.dismiss("loading-toast");
    });
    return;
  };

  useEffect(() => {
    loadBrokersData();
  }, []);

  const colorClass = (value) => {
    if (value > 5) {
      return "bg-red";
    } else if (value <= 5 && value > 3) {
      return "bg-yellow";
    } else if (value <= 3) {
      return "bg-green";
    }
  };

  const DownloadAllBrokerList = (selected) => {
    let fileName = `skyhawk_broker_submissions_${moment().format(
      "MM_DD_YYYY"
    )}.csv`;

    let fileData = [];

    let records = [...data];

    if (selected) {
      // filter to only selected entries
      records = records.filter((x) => x.selected);
    }

    records.forEach((row) => {
      fileData.push({
        prefecture: row.Name ? row.Name.split(",").join("-") : "-",
        broker_name: row.BrokerName ? row.BrokerName.split(",").join("-") : "-",
        broker_id: row.BrokerID ? row.BrokerID.split(",").join("-") : "-",
        company: row.Company,
        email: row.Email,
        size: row.Area,
        price: row.Price,
        score: row.analysis.totalRiskScore,
        date: row.Date,
      });
    });

    fileData = convertToCSV(fileData);

    exportFile(fileData, fileName, "text/csv");
  };

  const selectRow = (rowIndex) => {
    let records = [...data];
    if (records[rowIndex].selected) {
      records[rowIndex].selected = false;
    } else {
      records[rowIndex].selected = true;
    }
    setData(records);
  };

  const deleteBrokerEntry = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Please confrom that you want to delete plot for: ${item.Name}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: `Confirm`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        axios
          .post("/api/delete_broker_submission", {
            documentId: item._id,
          })
          .then((res) => {
            if (res.data.message === "Sucessfully deleted") {
              Swal.fire("Deleted entry!", "", "success");
              loadBrokersData();
            }
          })
          .catch((err) => {
            Swal.fire(
              "Error",
              "Something went wrong, failed to delete entry.",
              "error"
            );
          });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  return (
    <div>
      <AdminSidebar activeLink="Broker Submissions" />
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
              <div className="col">
                <h1 className="display-2 text-white">Broker Submissions</h1>
                <p className="text-white mt-0 mb-2">
                  This page contains the list of all the submitted plots from
                  the external dashboard.
                </p>

                <div className="banner-menu">
                  <button className="btn btn-white" onClick={loadBrokersData}>
                    <i className="la la-square mr-2 text-plot" />
                    Reload Submissions
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={
                      data.filter((x) => x.selected === true).length === 0
                        ? true
                        : false
                    }
                    onClick={() => {
                      DownloadAllBrokerList(true);
                    }}
                  >
                    <i className="la la-download mr-2" />
                    Download Selected (
                    {data.filter((x) => x.selected === true).length})
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      DownloadAllBrokerList(false);
                    }}
                  >
                    <i className="la la-download mr-2" />
                    Download All ({data.length})
                  </button>
                  <input
                    type="text"
                    id="input-username"
                    className="form-control"
                    placeholder="Search submitted plots"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        searchData(e);
                      }
                    }}
                  />
                  <button className="btn btn-default">
                    <i className="la la-search" />
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
                          <th scope="col">Prefecture</th>
                          <th scope="col">Broker Name</th>
                          <th scope="col">Broker ID</th>
                          <th scope="col">Company</th>
                          <th scope="col">Email</th>
                          <th scope="col">Area Size</th>
                          <th scope="col">Price</th>
                          <th scope="col">Score</th>
                          <th scope="col">Date Sumbitted</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {data &&
                          data.map((item, index) => {
                            return (
                              <tr
                                className={`${
                                  item.selected ? "table-row-selected" : ""
                                }`}
                              >
                                <th scope="row" title={item.Name}>
                                  <div className="media align-items-center">
                                    <div className="media-body">
                                      <span className="name mb-0 text-sm">
                                        <input
                                          type="checkbox"
                                          className="mr-2"
                                          checked={item.selected ? true : false}
                                          onClick={() => {
                                            selectRow(index);
                                          }}
                                        />
                                        {item.Name.substring(0, 25)}...
                                      </span>
                                    </div>
                                  </div>
                                </th>
                                <td className="budget">{item.BrokerName}</td>
                                <td className="budget">{item.BrokerID}</td>
                                <td className="budget">{item.Company}</td>
                                <td>
                                  <span className="status">{item.Email}</span>
                                </td>
                                <td>
                                  <span>{item.Area}sqm</span>
                                </td>
                                <td>
                                  <span>${item.Price}</span>
                                </td>
                                <td>
                                  <button
                                    className={`btn btn-sm ${colorClass(
                                      item.analysis.totalRiskScore
                                    )}`}
                                  >
                                    {item.analysis.totalRiskScore.toFixed(2)}
                                  </button>
                                </td>
                                <td>
                                  {moment(item.Date).format("MMM D, YYYY")}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-default btn-sm"
                                    onClick={() => {
                                      deleteBrokerEntry(item);
                                    }}
                                  >
                                    <i className="la la-trash text-danger" />{" "}
                                    Delete
                                  </button>
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

export default BrokerSubmissionsPage;
