import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "../public/css/argon.min.css";
import "../styles/sidebar.scss";
import "../styles/parameters.scss";
import "../styles/risk-indicator.scss";
import "../styles/main-tab.scss";
import "../styles/animations.scss";
import "../styles/map.scss";
import "../styles/settings.scss";
import "react-toastify/dist/ReactToastify.css";
import "../styles/sign-in.scss";
import "../styles/broker.scss";
import "../styles/profile.scss";
import "../styles/admin.scss";
import "../styles/globals.scss";
import "../styles/submit-page.scss";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
