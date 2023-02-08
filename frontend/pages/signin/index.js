import Layout from "../../components/Layout/Layout";
import { signInWithGoogle } from "../../firebase/firebaseClient";

export default function SignIn() {
  return (
    <Layout>
      <div className="signin-page">
        <div className="login-container fade-in-bottom dl-3">
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
                  <i className="la la-bullseye text-danger" /> Japan Zone Risk
                  Map
                </h3>
              </div>
            </div>
          </div>

          <div className="welcome-container">
            <h1>Welcome!</h1>
            <p className="text-dark">Sign in to the internal dashboard.</p>
            <div className="row">
              <a
                className="btn btn-lg btn-google btn-block btn-outline"
                href="#"
                onClick={signInWithGoogle}
              >
                <img
                  src="https://img.icons8.com/color/16/000000/google-logo.png"
                  id="google-img"
                />{" "}
                Sign in with Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
