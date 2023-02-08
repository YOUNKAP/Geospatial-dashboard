import { toast } from "react-toastify";
export const API_URL = "/api";
import moment from "moment";

export const errorToast = (message, position, duration) => {
  toast.error(message, {
    position: position ? position : "bottom-left",
    autoClose: duration ? duration : 2500,
    pauseOnHover: false,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
  });
};

export const successToast = (message, position, duration) => {
  toast.success(message, {
    position: position ? position : "bottom-left",
    autoClose: duration ? duration : 1200,
    pauseOnHover: false,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
  });
};

export const exportScoreSettings = () => {
  const element = document.createElement("a");
  const file = new Blob([localStorage.customScores], {
    type: "text/json",
  });
  element.href = URL.createObjectURL(file);
  element.download = `skyhawk_layer_scores_${moment().format(
    "MM_DD_YYYY"
  )}.json`;
  document.body.appendChild(element);
  element.click();
};

export const loadingToast = (message) => {
  toast.loading(message, {
    toastId: "loading-toast",
    position: "top-center",
    autoClose: 3000,
    pauseOnHover: false,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    progress: undefined,
  });
};

export const fetchUser = () => {
  return JSON.parse(localStorage.user);
};

export const exportFile = (data, file_name, type) => {
  const element = document.createElement("a");
  const file = new Blob([data], {
    type: type,
  });
  element.href = URL.createObjectURL(file);
  element.download = file_name;
  document.body.appendChild(element);
  element.click();
};

export function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join("\n");
}
