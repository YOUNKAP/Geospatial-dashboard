import AdminSidebar from "./AdminSidebar";
import AdminTopNav from "./AdminTopNav";
import AdminProfileCard from "./AdminProfileCard";
import AdminFooter from "./AdminFooter";
import { useState, useEffect } from "react";
import { fetchUser } from "../Util";

const ProfileAdminPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(fetchUser());
  }, []);

  return (
    <div>
      <AdminSidebar activeLink="Profile" />
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
              <div className="col-lg-7 col-md-10">
                <h1 className="display-2 text-white">Profile Settings</h1>
                <p className="text-white mt-0 mb-2">
                  This is your personal profile page, where you can manage your
                  passwords, and other profile information.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid mt--6">
          <div className="row">
            <AdminProfileCard />
            <div className="col-xl-8 order-xl-1">
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <h3 className="mb-0">Edit profile </h3>
                    </div>
                  </div>
                </div>
                <div className="card-body card-shadow">
                  <form>
                    <h4 className="heading-medium text-dark mb-4">
                      <i className="la la-user text-primary" /> Change User
                      Information
                    </h4>
                    {user && (
                      <div className="pl-lg-4">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                className="form-control-label"
                                htmlFor="input-username"
                              >
                                Full Name
                              </label>
                              <input
                                type="text"
                                id="input-username"
                                className="form-control"
                                placeholder="Full Name"
                                defaultValue={user.name}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                className="form-control-label"
                                htmlFor="input-email"
                              >
                                Email address
                              </label>
                              <input
                                type="email"
                                id="input-email"
                                className="form-control"
                                placeholder="Email address"
                                defaultValue={user.email}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label
                                className="form-control-label"
                                htmlFor="input-first-name"
                              >
                                <i className="la la-square text-success" /> User
                                Role
                              </label>
                              <input
                                type="text"
                                id="input-first-name"
                                className="form-control"
                                placeholder="User Role"
                                defaultValue="Super Admin"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <hr className="my-4" />
                    <h4 className="heading-medium text-dark mb-4">
                      <i className="la la-asterisk text-primary" /> Change
                      Password
                    </h4>
                    <div className="pl-lg-4">
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="form-group">
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              Old Password
                            </label>
                            <input
                              type="text"
                              id="input-city"
                              className="form-control"
                              placeholder="Old Password"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="form-group">
                            <label className="form-control-label">
                              New Password
                            </label>
                            <input
                              type="text"
                              id="input-country"
                              className="form-control"
                              placeholder="New Password"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <button className="btn btn-default ml-auto">
                      Save Changes
                    </button>
                  </form>
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

export default ProfileAdminPage;
