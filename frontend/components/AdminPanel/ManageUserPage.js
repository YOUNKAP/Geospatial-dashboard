import AdminSidebar from "./AdminSidebar";
import AdminTopNav from "./AdminTopNav";
import AdminFooter from "./AdminFooter";
import axios from "axios";
import { useEffect, useState } from "react";
import { errorToast, loadingToast, successToast } from "../Util";
import { toast } from "react-toastify";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    axios.post(`/api/users/list-users`).then((res) => {
      setUsers(res.data);
    });
  };

  const updateUserDetails = (field, index, value) => {
    let userList = [...users];
    userList[index][field] = value;
    setUsers(userList);

    console.log(userList);
  };

  const saveUpdates = (index) => {
    const user = users[index];
    loadingToast(`Updating user: ${user.email}`);

    if (!user.name || !user.email || !user.role) {
      errorToast("Please complete the form to procceed.", "top-center");
      return false;
    }

    axios
      .post("/api/users/update-user", {
        updates: {
          ...user,
        },
      })
      .then((res) => {
        if (res.data.message === "Update successful") {
          successToast("Updated successful", "top-center");
        }
        toast.dismiss("loading-toast");
        loadUsers();
      })
      .catch((err) => {
        console.error(err);
        errorToast("User update failed.", "top-center");
        toast.dismiss("loading-toast");
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <AdminSidebar activeLink="Manage Users" />
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
                <h1 className="display-2 text-white">Manage Users Page</h1>
                <p className="text-white mt-0 mb-2">
                  This page allows you to add and manage admin users in the
                  dashboard
                </p>

                <div className="banner-menu">
                  <button className="btn btn-success">
                    <i className="la la-plus mr-2 text-active" />
                    Add new users
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
                          <th scope="col">Full Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Role</th>
                          <th scope="col">Status</th>
                          <th scope="col">Date Updated</th>
                          <th scope="col">Credentials</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {users.map((user, index) => {
                          return (
                            <tr>
                              <th scope="row">
                                <div className="media align-items-center">
                                  <div className="media-body">
                                    <div className="avatar-group">
                                      <a
                                        href="#"
                                        className="avatar avatar-sm rounded-circle flex-shrink-0"
                                        data-toggle="tooltip"
                                        title="Bryce Narciso Mercines"
                                        data-original-title="Bryce Narciso Mercines"
                                      >
                                        <img
                                          alt="Image placeholder"
                                          src={`https://avatars.dicebear.com/api/initials/${user.email}.svg`}
                                        />
                                      </a>
                                      <input
                                        type="text"
                                        className="form-control table-input"
                                        placeholder="Full Name"
                                        defaultValue={user.name}
                                        onChange={(e) => {
                                          updateUserDetails(
                                            "name",
                                            index,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </th>
                              <td>
                                <input
                                  type="text"
                                  className="form-control table-input"
                                  placeholder="Email Address"
                                  defaultValue={user.email}
                                  onChange={(e) => {
                                    updateUserDetails(
                                      "email",
                                      index,
                                      e.target.value
                                    );
                                  }}
                                />
                              </td>
                              <td className="classification">
                                <select
                                  className="form-control"
                                  className="data-class"
                                  defaultValue={user.role ? user.role : "admin"}
                                  onChange={(e) => {
                                    updateUserDetails(
                                      "role",
                                      index,
                                      e.target.value
                                    );
                                  }}
                                >
                                  <option value="super-admin">
                                    Super Admin
                                  </option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td>
                                <button
                                  className={`btn btn-sm ${
                                    user.active ? "bg-success" : "bg-muted"
                                  }`}
                                  onClick={() => {
                                    updateUserDetails(
                                      "active",
                                      index,
                                      !user.active
                                    );
                                  }}
                                >
                                  <i className="la la-square" />{" "}
                                  {user.active ? "Active" : "Suspended"}
                                </button>
                              </td>
                              <td>October 20, 2021</td>
                              <td>
                                <button className="btn btn-primary btn-sm mr-3">
                                  <i className="la la-spinner" /> Reset
                                  Credentials
                                </button>
                                <button
                                  className="btn btn-default btn-sm"
                                  title="This will copy the user's credentials to your clipboard"
                                >
                                  <i className="la la-copy text-info" /> Copy
                                  Credentials
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn btn-default btn-sm"
                                  onClick={() => {
                                    saveUpdates(index);
                                  }}
                                >
                                  <i className="la la-edit" /> Save
                                </button>
                                <button className="btn btn-danger btn-sm">
                                  <i className="la la-trash" /> Delete
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

export default ManageUsersPage;
