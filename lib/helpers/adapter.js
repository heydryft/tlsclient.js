"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HEADER_ORDER = exports.DEFAULT_HEADERS = exports.DEFAULT_CLIENT_ID = exports.createAdapter = void 0;
const workerpool_1 = __importDefault(require("workerpool"));
const http_1 = __importDefault(require("http"));
const axios_1 = require("axios");
const tlspath_1 = require("./tlspath");
let { TLS_LIB_PATH } = (0, tlspath_1.getTLSDependencyPath)();
let DEFAULT_CLIENT_ID = "chrome_120";
exports.DEFAULT_CLIENT_ID = DEFAULT_CLIENT_ID;
let DEFAULT_HEADERS = {
    accept: "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": `"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"`,
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
};
exports.DEFAULT_HEADERS = DEFAULT_HEADERS;
let DEFAULT_HEADER_ORDER = [
    "host",
    "x-real-ip",
    "x-forwarded-for",
    "connection",
    "content-length",
    "cache-control",
    "sec-ch-ua",
    "accept-datetime",
    "dnt",
    "x-csrf-token",
    "if-unmodified-since",
    "authorization",
    "x-requested-with",
    "if-modified-since",
    "max-forwards",
    "x-http-method-override",
    "x-request-id",
    "sec-ch-ua-platform",
    "pragma",
    "upgrade-insecure-requests",
    "sec-ch-ua-mobile",
    "user-agent",
    "content-type",
    "if-none-match",
    "if-match",
    "if-range",
    "range",
    "accept",
    "origin",
    "sec-fetch-site",
    "sec-fetch-mode",
    "sec-fetch-dest",
    "referer",
    "accept-encoding",
    "accept-language",
];
exports.DEFAULT_HEADER_ORDER = DEFAULT_HEADER_ORDER;
function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
    }
    else {
        reject(new axios_1.AxiosError("Request failed with status code " + response.status, [axios_1.AxiosError.ERR_BAD_REQUEST, axios_1.AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4], response.config, response.request, response));
    }
}
function createAdapter(_config) {
    if (_config === null || _config === void 0 ? void 0 : _config.tlsLibPath) {
        TLS_LIB_PATH = _config.tlsLibPath;
    }
    const pool = workerpool_1.default.pool(require.resolve("@dryft/tlsclient/lib/helpers/tls.js"), {
        workerThreadOpts: {
            env: {
                TLS_LIB_PATH,
            },
        },
    });
    return function (config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const requestPayload = {
                tlsClientIdentifier: config.tlsClientIdentifier || DEFAULT_CLIENT_ID,
                followRedirects: config.followRedirects || false,
                insecureSkipVerify: config.insecureSkipVerify || true,
                withoutCookieJar: true,
                withDefaultCookieJar: false,
                isByteRequest: false,
                catchPanics: false,
                withDebug: false,
                forceHttp1: config.forceHttp1 || false,
                withRandomTLSExtensionOrder: config.withRandomTLSExtensionOrder || true,
                timeoutSeconds: config.timeout / 1000 || 30,
                timeoutMilliseconds: 0,
                sessionId: Date.now().toString(),
                isRotatingProxy: false,
                proxyUrl: config.proxy || "",
                customTlsClient: config.customTlsClient || undefined,
                certificatePinningHosts: {},
                headers: Object.assign(Object.assign({}, (config.defaultHeaders || DEFAULT_HEADERS)), config.headers),
                headerOrder: config.headerOrder || DEFAULT_HEADER_ORDER,
                requestUrl: config.url,
                requestMethod: config.method.toUpperCase(),
                requestBody: config.data,
            };
            let res = yield pool.exec("request", [JSON.stringify(requestPayload)]);
            const resJSON = JSON.parse(res);
            let resHeaders = {};
            Object.keys(resJSON.headers).forEach((key) => {
                resHeaders[key] = resJSON.headers[key].length === 1
                    ? resJSON.headers[key][0]
                    : resJSON.headers[key];
            });
            var response = {
                data: resJSON.body,
                status: resJSON.status,
                statusText: http_1.default.STATUS_CODES[resJSON.status],
                headers: resHeaders,
                config,
                request: {
                    responseURL: encodeURI(resJSON.headers && resJSON.headers.Location
                        ? resJSON.headers.Location[0]
                        : resJSON.target),
                },
            };
            settle(resolve, reject, response);
        }));
    };
}
exports.createAdapter = createAdapter;
