import { createTLSClient } from "./src/index.ts";

const tlsclient = createTLSClient({});
tlsclient
  .get("https://tls.peet.ws/api/all", {
    // proxy: "http://2jhf0xt2:fvc567cvvb@89.33.163.212:1762",
  })
  .then((res) => {
    console.log(res.data);
  });
