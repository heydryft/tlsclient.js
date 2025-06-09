"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workerpool_1 = __importDefault(require("workerpool"));
const ffi_rs_1 = require("ffi-rs");
(0, ffi_rs_1.open)({
    library: "tls",
    path: process.env.TLS_LIB_PATH,
});
let instance = {
    request: (payload) => {
        let res = (0, ffi_rs_1.load)({
            library: "tls",
            funcName: "request",
            retType: 0,
            paramsType: [0],
            paramsValue: [payload],
        });
        return res;
    },
    getCookiesFromSession: (payload) => {
        let res = (0, ffi_rs_1.load)({
            library: "tls",
            funcName: "getCookiesFromSession",
            retType: 0,
            paramsType: [0],
            paramsValue: [payload],
        });
        return res;
    },
    addCookiesToSession: (payload) => {
        let res = (0, ffi_rs_1.load)({
            library: "tls",
            funcName: "addCookiesToSession",
            retType: 0,
            paramsType: [0],
            paramsValue: [payload],
        });
        return res;
    },
    freeMemory: (payload) => {
        let res = (0, ffi_rs_1.load)({
            library: "tls",
            funcName: "freeMemory",
            retType: 2,
            paramsType: [0],
            paramsValue: [payload],
        });
        return res;
    },
    destroyAll: () => {
        let res = (0, ffi_rs_1.load)({
            library: "tls",
            funcName: "destroyAll",
            retType: 0,
            paramsType: [],
            paramsValue: [],
        });
        return res;
    },
    destroySession: (payload) => {
        let res = (0, ffi_rs_1.load)({
            library: "tls",
            funcName: "destroySession",
            retType: 0,
            paramsType: [0],
            paramsValue: [payload],
        });
        return res;
    },
};
workerpool_1.default.worker({
    request: instance.request,
});
