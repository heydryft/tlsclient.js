import Benchmarkify from "benchmarkify";
import { createTLSClient } from "./src/index.js";

const tlsclient = createTLSClient();
import ffi from "ffi-napi";

const tlsClientLibrary = ffi.Library("./dependencies/tls-mac-arm.dylib", {
  request: ["string", ["string"]],
  getCookiesFromSession: ["string", ["string"]],
  addCookiesToSession: ["string", ["string"]],
  freeMemory: ["void", ["string"]],
  destroyAll: ["string", []],
  destroySession: ["string", ["string"]],
});

const benchmark = new Benchmarkify("tlsclient.js vs ffi-napi", {
  description: "",
  chartImage: true,
}).printHeader();

let payload = {
  tlsClientIdentifier: "chrome_103",
  followRedirects: true,
  insecureSkipVerify: false,
  withoutCookieJar: false,
  withDefaultCookieJar: false,
  isByteRequest: false,
  forceHttp1: false,
  withRandomTLSExtensionOrder: false,
  timeoutSeconds: 30,
  timeoutMilliseconds: 0,
  sessionId: "my-session-id",
  proxyUrl: "",
  isRotatingProxy: false,
  certificatePinningHosts: {},
  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
  },
  headerOrder: ["accept", "user-agent", "accept-encoding", "accept-language"],
  requestUrl: "https://ipv4.icanhazip.com",
  requestMethod: "GET",
  requestBody: "",
  requestCookies: [],
};

// Create a test suite
benchmark
  .createSuite("Request", {
    time: 1000,
    description: "A sample request to ipv4.icanhazip.com",
  })

  .add("With tlsclient.js", async () => {
    await tlsclient.get("https://ipv4.icanhazip.com");
    return;
  })

  .ref("With ffi-napi manual implementation", async () => {
    await new Promise((resolve) => {
      tlsClientLibrary.request.async(JSON.stringify(payload), () => {
        resolve();
      });
    });
    return;
  });

benchmark.run();
