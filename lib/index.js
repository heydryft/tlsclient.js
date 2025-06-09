"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTLSClient = exports.DEFAULT_HEADER_ORDER = exports.DEFAULT_HEADERS = exports.DEFAULT_CLIENT_ID = void 0;
const axios_1 = __importDefault(require("axios"));
const adapter_1 = require("./helpers/adapter");
Object.defineProperty(exports, "DEFAULT_CLIENT_ID", { enumerable: true, get: function () { return adapter_1.DEFAULT_CLIENT_ID; } });
Object.defineProperty(exports, "DEFAULT_HEADERS", { enumerable: true, get: function () { return adapter_1.DEFAULT_HEADERS; } });
Object.defineProperty(exports, "DEFAULT_HEADER_ORDER", { enumerable: true, get: function () { return adapter_1.DEFAULT_HEADER_ORDER; } });
/**
 * Create a TLS client.
 * Extra/Modified options available in config (can be also used per request (except tlsLibPath)) are:
 * - `proxy` - The proxy to use. (http://user:pass@host:port)
 * - `tlsClientIdentifier` - Choose the desired tls client. (https://github.com/bogdanfinn/tls-client/blob/master/profiles/profiles.go#L10)
 * - `customTlsClient` - Use a custom tls client instead of the default one. (https://github.com/bogdanfinn/tls-client/blob/master/cffi_dist/example_node/index_custom_client.js#L27)
 * - `tlsLibPath` - Specify path for a bogdanfinn/tls-client fork (.dll, .dylib, .so) (optional).
 * - `forceHttp1` - Force http1.
 * - `followRedirects` - Follow redirects.
 * - `insecureSkipVerify` - Skip tls certificate verification.
 * - `withRandomTLSExtensionOrder` - Randomize the order of tls extensions.
 * - `timeout` - Request timeout.
 * - `defaultHeaders` - Default headers to use. Usually the browser default headers.
 * - `headerOrder` - The order of the headers.
 */
function createTLSClient(config = {}) {
    let adapter = (0, adapter_1.createAdapter)(config);
    return axios_1.default.create(Object.assign({ adapter }, config));
}
exports.createTLSClient = createTLSClient;
exports.default = createTLSClient;
