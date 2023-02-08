import { useContext } from "react";
// import { auth } from "../../firebase/firebaseClient";
import { UserContext } from "../AppContext/AppContext";
// import { loadingToast } from "../Util";

const UserProfileBar = () => {
  const { user } = useContext(UserContext);

  // const signOut = () => {
  //   auth.signOut();
  //   localStorage.removeItem("user");
  //   loadingToast("Signing out...");
  //   window.location.href = "/signin";
  // };

  const gotoProfile = () => {
    window.location.href = "/admin/profile";
  };

  return (
    <>
      {user && (
        <div className="profile-bar fade-in-bottom">
          <img src={user.picture} className="avatar" />
          <div className="user-info">
            <span>{user.name}</span>
            <small>Internal User</small>
          </div>

          <i
            className="la la-bars la-2x ml-auto text-primary"
            title="View Profile"
            onClick={gotoProfile}
          />
        </div>
      )}
    </>
  );
};

export default UserProfileBar;
