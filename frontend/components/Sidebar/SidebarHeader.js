import SearchSidebar from "./SearchSidebar";
export default function SidebarHeader() {
  return (
    <>
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
              <i className="la la-bullseye text-danger" /> Japan Zone Risk Map
            </h3>
          </div>
        </div>
        <SearchSidebar />
        
      </div>
      
    </>
  );
}
