const fse = require("fs-extra");
const { exec } = require("child_process");
require("dotenv").config();
const AWS = require("aws-sdk");
const mbxUploads = require("@mapbox/mapbox-sdk/services/uploads");
const mbxClient = require("@mapbox/mapbox-sdk");
const axios = require("axios");

console.log(`
===========================================================
███████ ██   ██ ██    ██ ██   ██  █████  ██     ██ ██   ██ 
██      ██  ██   ██  ██  ██   ██ ██   ██ ██     ██ ██  ██  
███████ █████     ████   ███████ ███████ ██  █  ██ █████   
     ██ ██  ██     ██    ██   ██ ██   ██ ██ ███ ██ ██  ██  
███████ ██   ██    ██    ██   ██ ██   ██  ███ ███  ██   ██ 
===========================================================
        Skyhawk Project - Data upload pipeline
===========================================================
`);

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_DATA_TOKEN;
const DATASET_DIR = "./input-datasets";

if (!MAPBOX_ACCESS_TOKEN) {
  console.error("Error: No mapbox access token");
  return false;
}

console.log("✅ Checking Access token:", MAPBOX_ACCESS_TOKEN);

const datasetFiles = fse.readdirSync(DATASET_DIR);
console.log("✅  Dataset DIR:", DATASET_DIR);
console.log("🎉 Files found:", datasetFiles.length);

// datasetFiles.forEach((file) => {
//   console.log(file);
// });

// init mapbox token
const baseClient = mbxClient({ accessToken: MAPBOX_ACCESS_TOKEN });
const uploadsClient = mbxUploads(baseClient);
const mapboxUser = process.env.MAPBOX_USERNAME;

const triggerMBUpload = (credentials) => {
  axios
    .post(
      `https://api.mapbox.com/uploads/v1/${mapboxUser}?access_token=${MAPBOX_ACCESS_TOKEN}`,
      {
        url: `http://${credentials.bucket}.s3.amazonaws.com/${credentials.key}`,
        tileset: `${mapboxUser}.fx2`,
        name: "fault_lines",
      }
    )
    .then((res) => {
      console.log("✅ Started Upload.");
      console.log(res.data);
    });
};

const getCredentials = () => {
  return uploadsClient
    .createUploadCredentials()
    .send()
    .then((response) => response.body);
};

const putFileOnS3 = (credentials) => {
  console.log(credentials);
  const s3 = new AWS.S3({
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    region: "us-east-1",
  });
  return s3
    .putObject({
      Bucket: credentials.bucket,
      Key: credentials.key,
      Body: fse.createReadStream(`${DATASET_DIR}/fault_line.geojson`),
    })
    .promise()
    .then((res) => {
      console.log(res);
      console.log("✅ 100% Uploaded to Mapbox AWS S3 bucket.");

      triggerMBUpload(credentials);
    });
};

// getCredentials().then(putFileOnS3);
