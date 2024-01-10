import fs from "fs";
import axios from "axios";
import { getTLSDependencyPath } from "../lib/tlspath.js";

function downloadFile(url, destination) {
  const file = fs.createWriteStream(destination);
  axios({
    url,
    method: "GET",
    responseType: "stream",
  })
    .then((response) => {
      response.data.pipe(file);
      return new Promise((resolve, reject) => {
        file.on("finish", () => {
          console.log("Downloaded tls dependencies.");
          resolve();
        });
        file.on("error", () => {
          console.error("Error downloading tls dependencies.");
          reject();
        });
      });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

let { DOWNLOAD_PATH, TLS_LIB_PATH } = getTLSDependencyPath();
downloadFile(DOWNLOAD_PATH, TLS_LIB_PATH);
