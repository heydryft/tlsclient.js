# tlsclient.js

An axios based wrapper for `bogdanfinn/tls-client` based on ffi-rs for unparalleled performance and usability.

## Performance

![perf](https://i.ibb.co/WxdLcRD/Screenshot-2024-01-10-at-1-16-55-AM.png)

## Installation

Install with npm

```bash
  npm i @dryft/tlsclient
```

## Usage

### First run:

```javascript
import { createTLSClient } from "@dryft/tlsclient";

const axios = createTLSClient();
let res = await axios.get("https://ipv4.icanhazip.com");
```

### Definition

```javascript
**
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
 * @param {TLSClientConfiguration} config The configuration.
 *
 * @returns {AxiosInstance} The TLS client.
 */
export function createTLSClient(config) {
  let adapter = createAdapter(config);
  return axios.create({
    adapter,
    ...config,
  });
}
```
