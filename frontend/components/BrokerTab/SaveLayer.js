import axios from "axios";
import swal from "sweetalert2";
export function SaveLayer(data) {
  let filtered = data.map(({ Marker, ...rest }) => {
    var n = new Date();
    var y = n.getFullYear();
    var m = n.getMonth() + 1;
    var d = n.getDate();
    rest.Date = m + "/" + d + "/" + y;
    return rest;
  });

  swal.fire({
    icon: "info",
    title: "Submitting..",
    text: "Please wait, this might take a few moments..",
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  swal.showLoading();

  axios
    .post("/api/storebroker", filtered)
    .then((res) => {
      swal.fire({
        icon: "success",
        title: "Thank you for submitting!",
        text: "We have successfully received your submission.",
      });
    })
    .catch((error) => {
      console.log(error);
      swal.fire({
        icon: "error",
        title: "Submission failed!",
        text: "There was a problem with your submission.",
      });
    });
}

export async function GetLayer() {
  console.log("Getting Data");
  try {
    const data = await axios.get("/api/storebroker");
    return data;
  } catch (err) {
    console.log(err);
  }
}
