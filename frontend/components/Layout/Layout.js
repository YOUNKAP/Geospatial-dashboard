import Head from "next/head";
import { ToastContainer } from "react-toastify";

const Layout = (props) => {
  return (
    <>
      <ToastContainer />
      <Head>
        <link rel="icon" href="/images/apl-skyhawk-logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="Skyhawk" content="Web application" />
        <meta
          property="og:title"
          content="APL Group Skyhawk Project - Japan Zone Risk Map"
        />
        <meta property="og:image" content="/images/site-banner.png" />
        <meta
          property="og:url"
          content="https://aplgroup-skyhawk.vercel.app/"
        />
        <meta
          property="og:description"
          content="APL Group Skyhawk Project - Japan Zone Risk Map"
        />

        <title>Skyhawk Project - APL Group</title>
        <link
          rel="stylesheet"
          href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css"
        />
      </Head>
      {props.children}
    </>
  );
};

export default Layout;
