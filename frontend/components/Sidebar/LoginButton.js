import { useContext } from "react";
import { UserContext } from "../AppContext/AppContext";

const LoginButton = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="login-button fade-in">
      {!user && (
        <a href="/signin">
          <button className="btn btn-default">
            Login <i className="la la-sign-in-alt text-info" />
          </button>
        </a>
      )}
    </div>
  );
};

export default LoginButton;
