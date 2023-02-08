import { useEffect, useState } from "react";
import { fetchUser } from "../Util";

const AdminProfileCard = () => {
  const signOut = () => {
    localStorage.clear("users");
    window.location.href = "/signin";
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    let userdata = fetchUser();
    setUser(userdata);
  }, []);

  return (
    <>
      {user && (
        <div className="col-xl-4 order-xl-2 fade-in-bottom">
          <div className="card card-profile" id="admin-profile-card">
            <img
              src="https://images.pexels.com/photos/288099/pexels-photo-288099.jpeg?auto=compress&cs=tinysrgb&w=300&h=250&dpr=2"
              alt="Image placeholder"
              className="card-img-to profile-banner"
            />
            <div className="row justify-content-center">
              <div className="col-lg-3 order-lg-2">
                <div className="card-profile-image">
                  <img src={user.picture} className="rounded user-avatar" />
                </div>
              </div>
            </div>
            {/* <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                        <div className="d-flex justify-content-between">
                          <a href="#" className="btn btn-sm btn-info  mr-4 ">
                            Connect
                          </a>
                          <a
                            href="#"
                            className="btn btn-sm btn-default float-right"
                          >
                            Message
                          </a>
                        </div>
                      </div> */}
            <div className="card-body pt-4">
              <br />
              {/* <div className="row">
                          <div className="col">
                            <div className="card-profile-stats d-flex justify-content-center">
                              <div>
                                <span className="heading">22</span>
                                <span className="description">Friends</span>
                              </div>
                              <div>
                                <span className="heading">10</span>
                                <span className="description">Photos</span>
                              </div>
                              <div>
                                <span className="heading">89</span>
                                <span className="description">Comments</span>
                              </div>
                            </div>
                          </div>
                        </div> */}
              <div className="text-center mt-5">
                <h5 className="h3">{user.name}</h5>
                <div className="h5 font-weight-300">
                  <i className="la la-envelope mr-2" />
                  {user.email}
                </div>
                <div className="h5 my-4">
                  <span>
                    <i className="la la-square mr-2 text-success" />
                    Super Admin
                  </span>
                </div>

                <div>
                  <button className="btn btn-default" onClick={signOut}>
                    Log out <i className="la la-sign-out-alt text-info" />
                  </button>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProfileCard;
