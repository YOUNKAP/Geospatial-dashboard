export default function AdminSidebar(props) {
  const userRole = "super-admin";

  const AdminModules = [
    {
      url: "/",
      name: "Internal Dashboard",
      icon: "la-map",
      tags: ["admin", "super-admin"],
    },
    {
      url: "/admin/profile",
      name: "Profile",
      icon: "la-user",
      tags: ["admin", "super-admin"],
    },
    {
      url: "/admin/broker-submissions",
      name: "Broker Submissions",
      icon: "la-list",
      tags: ["admin", "super-admin"],
    },
    {
      url: "/admin/scoring-algorithm-editor",
      name: "Edit Scoring Algo",
      icon: "la-cube",
      tags: ["admin", "super-admin"],
    },
    {
      url: "/admin/manage-users",
      name: "Manage Users",
      icon: "la-users",
      tags: ["super-admin"],
    },
  ];

  return (
    <>
      <nav className="sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-light bg-white">
        <div className="scrollbar-inner">
          <div className="sidenav-header  align-items-center">
            <div className="sidebar-header">
              <div className="title-bar">
                <div className="logo">
                  <img src="/images/apl-logo.png" alt="skyhawk-brand" />
                </div>
                <div className="title">
                  <h2>
                    <span>Skyhawk Project</span>
                  </h2>
                  <h3>
                    <i className="la la-square text-info" /> Admin Dashboard
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="navbar-inner">
            <div
              className="collapse navbar-collapse"
              id="sidenav-collapse-main"
            >
              <div className="sidebar-links">
                {AdminModules.filter((x) => x.tags.includes(userRole)).map(
                  (link) => {
                    return (
                      <div
                        className={`sidebar-link ${
                          props.activeLink === link.name ? "active" : ""
                        }`}
                      >
                        <a href={link.url}>
                          <i className={`la ${link.icon}`}></i>
                          <span>{link.name}</span>
                        </a>
                      </div>
                    );
                  }
                )}
              </div>

              {/* <hr className="my-3" />
              <h6 className="navbar-heading p-0 text-muted">
                <span className="docs-normal">Documentation</span>
              </h6> */}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
