import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import axios from "axios";
import { errorToast, loadingToast, successToast } from "../components/Util";
import { toast } from "react-toastify";

const clientCredentials = {
  apiKey: "AIzaSyC0pNRnZj0nTrlmlyzwhDjKpYsA_teF39A",
  authDomain: "skyhawk-project.firebaseapp.com",
  projectId: "skyhawk-project",
  storageBucket: "skyhawk-project.appspot.com",
  messagingSenderId: "62583577837",
  appId: "1:62583577837:web:7a65a49f03ba10328580e4",
  measurementId: "G-2Q8NH9HR59",
};

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}

export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () =>
  auth
    .signInWithPopup(provider)
    .then((res) => {
      let profile = res.additionalUserInfo.profile;
      loadingToast("Logging in...");
      axios
        .post("/api/authenticate", {
          email: profile.email,
        })
        .then((resp) => {
          if (resp.data === "valid user") {
            localStorage.user = JSON.stringify(profile);
            successToast("Logged In", "top-center");
            setTimeout(() => {
              window.location.href = "/";
            }, 1200);
          } else {
            errorToast(
              "Log in failed. You have no access to this system.",
              "top-center"
            );
          }
          toast.dismiss("loading-toast");
        });
    })
    .catch((err) => {
      console.error(err);
      errorToast("Authentication failed!", "top-center");
      toast.dismiss("loading-toast");
    });

export const db = firebase.firestore();

export default firebase;
