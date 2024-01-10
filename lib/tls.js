import workerpool from "workerpool";
import { load, open } from "ffi-rs";

open({
  library: "tls",
  path: process.env.TLS_LIB_PATH,
});

let instance = {
  request: (payload) => {
    let res = load({
      library: "tls",
      funcName: "request",
      retType: 0,
      paramsType: [0],
      paramsValue: [payload],
    });
    return res;
  },
  getCookiesFromSession: (payload) => {
    let res = load({
      library: "tls",
      funcName: "getCookiesFromSession",
      retType: 0,
      paramsType: [0],
      paramsValue: [payload],
    });
    return res;
  },
  addCookiesToSession: (payload) => {
    let res = load({
      library: "tls",
      funcName: "addCookiesToSession",
      retType: 0,
      paramsType: [0],
      paramsValue: [payload],
    });
    return res;
  },
  freeMemory: (payload) => {
    let res = load({
      library: "tls",
      funcName: "freeMemory",
      retType: 2,
      paramsType: [0],
      paramsValue: [payload],
    });
    return res;
  },
  destroyAll: () => {
    let res = load({
      library: "tls",
      funcName: "destroyAll",
      retType: 0,
      paramsType: [],
      paramsValue: [],
    });
    return res;
  },
  destroySession: (payload) => {
    let res = load({
      library: "tls",
      funcName: "destroySession",
      retType: 0,
      paramsType: [0],
      paramsValue: [payload],
    });
    return res;
  },
};

workerpool.worker({
  request: instance.request,
});
