import axios from 'axios'
import {
  createAdapter,
  DEFAULT_CLIENT_ID,
  DEFAULT_HEADERS,
  DEFAULT_HEADER_ORDER,
} from "./helpers/adapter.mjs";

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
  let adapter = createAdapter(config);
  return axios.create({
    adapter,
    ...config,
  });
}

export default createTLSClient;

export {
  DEFAULT_CLIENT_ID,
  DEFAULT_HEADERS,
  DEFAULT_HEADER_ORDER,
  createTLSClient,
};
