import { useEffect, useState } from "react";

const PageLoader = () => {
  const [renderLoad, setrenderLoad] = useState(true);

  useEffect(() => {
    if (localStorage.user) {
      document.querySelector(".page-loader").classList.add("fade-out");
      setTimeout(() => {
        setrenderLoad(false);
      }, 700);
    } else {
      window.location.href = "/signin";
    }
  }, []);

  return (
    <>
      {renderLoad && (
        <div className={`page-loader`}>
          <div className="spinner">
            <i className="la la-spinner text-primary spin la-4x" />
          </div>
        </div>
      )}
    </>
  );
};

export default PageLoader;
