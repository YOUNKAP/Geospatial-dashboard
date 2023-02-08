import { useState, useEffect } from "react";
import { fetchUser } from "../Util";

export default function AdminTopNav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(fetchUser());
  }, []);

  return (
    <nav className="navbar navbar-top navbar-expand bg-dark navbar-dark bg-default">
      <div className="container-fluid">
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav align-items-center ml-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link pr-0"
                href="#"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {user && (
                  <a href="/admin/profile">
                    <div className="media align-items-center fade-in">
                      <span className="avatar avatar-sm rounded-circle">
                        <img alt="Image placeholder" src={user.picture} />
                      </span>

                      <div className="media-body  ml-2  d-none d-lg-block">
                        <span className="mb-0 text-sm  font-weight-bold">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  </a>
                )}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
