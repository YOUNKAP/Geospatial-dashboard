const fse = require("fs-extra");
const { exec } = require("child_process");

console.log("Processing Datasets..");

const INPUT_DATASET_DIR = "./input-datasets";
const OUTPUT_DATASET_DIR = "./output-datasets";
const OUTPUT_SQL_DIR = "./output-sql";
const BACKEND_GEOJSON_DIR = "../backend/geojson-datasets";

const DB_NAME = "skyhawk-demo";

// create output SQL Dir if it doesn't exist
if (!fse.existsSync(OUTPUT_SQL_DIR)) {
  fse.mkdir(OUTPUT_SQL_DIR);
}

fse.readdir(INPUT_DATASET_DIR, (err, files) => {
  files.forEach(async (file) => {
    if (file) {
      console.log(`Processing file: ==> ${file}`);

      console.log(
        `Converting geoJSON to JSON: ==> ${INPUT_DATASET_DIR}/${file}`
      );
      fse.copySync(
        `${INPUT_DATASET_DIR}/${file}`,
        `${OUTPUT_DATASET_DIR}/${file}`.replace("geojson", "json"),
        { overwrite: true }
      );

      const targetFile = file.split(".")[0];
      console.log(targetFile);
      exec(
        `jq -c '.features[]' ${INPUT_DATASET_DIR}/${file} | mongoimport --drop -d ${DB_NAME} -c ${targetFile} --maintainInsertionOrder 'mongodb+srv://skyhawk1:Uyulo9WjXkdG0C5I@cluster0.45wrsmn.mongodb.net/?retryWrites=true&w=majority'`,
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`Uploading to MongoDB: ${file}`);
        }
      );

      // import geoJSON to database
      // console.log(file.split(".")[0]);
      // exec(
      //   `ogr2ogr -f PGDUMP ${OUTPUT_SQL_DIR}/${
      //     file.split(".")[0]
      //   }.sql -lco LAUNDER=NO -lco DROP_TABLE=OFF ${INPUT_DATASET_DIR}/${file}`,
      //   (error, stdout, stderr) => {
      //     if (error) {
      //       console.log(`error: ${error.message}`);
      //       return;
      //     }
      //     if (stderr) {
      //       console.log(`stderr: ${stderr}`);
      //       return;
      //     }
      //     console.log(`Processing geojson to sql: ${file}`);
      //   }
      // );
    }
  });
});

// fse.move(OUTPUT_DATASET_DIR, BACKEND_GEOJSON_DIR, { overwrite: true });
// if (!fse.existsSync(OUTPUT_DATASET_DIR)) {
//   fse.mkdir(OUTPUT_DATASET_DIR);
// }
