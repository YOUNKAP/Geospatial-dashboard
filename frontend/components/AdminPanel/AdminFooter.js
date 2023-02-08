const AdminFooter = () => {
  return (
    <footer className="footer pt-5 bg-transparent">
      <div className="row align-items-center justify-content-lg-between">
        <div className="col-lg-6">
          <div className="copyright text-center  text-lg-left  text-muted">
            © 2022{" "}
            <a
              href="https://aplgroup.com/"
              className="font-weight-bold ml-1"
              target="_blank"
            >
              APL Group | Skyhawk Project
            </a>
          </div>
        </div>
        <div className="col-lg-6">
          <ul className="nav nav-footer justify-content-center justify-content-lg-end">
            <li className="nav-item">
              <a href="/" className="nav-link">
                Internal Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a href="/admin/broker-submissions" className="nav-link">
                Broker Submissions
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
