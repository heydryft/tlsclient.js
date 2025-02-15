import workerpool from "workerpool";
import http from "http";
import axios from 'axios';
import { getTLSDependencyPath } from "./tlspath.mjs";
import path from 'path'

let { TLS_LIB_PATH } = getTLSDependencyPath();

let DEFAULT_CLIENT_ID = "chrome_120";
let DEFAULT_HEADERS = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
  'dpr':'1',
  'sec-ch-prefers-color-scheme':'light',
  "sec-ch-ua": `"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"`,
  "sec-ch-ua-full-version-list": `"Google Chrome";v="123.0.6312.122", "Not:A-Brand";v="8.0.0.0", "Chromium";v="123.0.6312.122"`,
  "sec-ch-ua-mobile": "?0",
  'sec-ch-ua-model': '""',
  "sec-ch-ua-platform": '"Linux"',
  'sec-ch-ua-platform-version': '"5.15.0"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  'upgrade-insecure-requests':'1',
  "user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  'viewport-width':'803'
};
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

export function createAdapter(_config) {
  if (_config?.tlsLibPath) {
    TLS_LIB_PATH = _config.tlsLibPath;
  }
  const pool = workerpool.pool(path.join(import.meta.dirname, 'tls.mjs'),
    {
      workerThreadOpts: {
        env: {
          TLS_LIB_PATH,
        },
      },
    }
  );
  return async function (config) {
      const requestPayload = {
        tlsClientIdentifier: config.tlsClientIdentifier || DEFAULT_CLIENT_ID,
        followRedirects: config.followRedirects || true,
        insecureSkipVerify: config.insecureSkipVerify || true,
        isByteRequest: true,
        isByteResponse: true,
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
        headerOrder: config.headerOrder || DEFAULT_HEADER_ORDER,
        requestUrl: config.params ? [config.url, new globalThis.URLSearchParams(config.params).toString()].join('?') : config.url, 
        requestMethod: config.method.toUpperCase(),
        requestBody:config.data instanceof globalThis.FormData ? await (async () => {const chunks = []; for await (const chunk of axios.formDataToStream(config.data, _ => config.headers.set(_))) chunks.push(globalThis.Buffer.from(chunk)); return globalThis.Buffer.concat(chunks).toString('base64')})() : globalThis.Object.is(typeof config.data, 'undefined') ? undefined : globalThis.btoa(config.data),
        headers: globalThis.Object.is(config.method, 'get') ? {...(config.defaultHeaders ?? DEFAULT_HEADERS), ...config.headers} : {...globalThis.Object.fromEntries(globalThis.Object.entries(config.headers).filter(_ => !globalThis.Object.is(_.at(0), 'Content-Length'))), 'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'},
        requestCookies: await config.cookiejar?.serialize()?.then(_ => _.cookies.map(_ => globalThis.Object.fromEntries(globalThis.Object.entries(_).map(_ => globalThis.Object.is(_.at(0), 'key') ? ['name', _.at(1)] : _)))) ?? []
      };
      let res = await pool.exec("request", [JSON.stringify(requestPayload)]);
      const resJSON = JSON.parse(res);
      let resHeaders = {};
      Object.keys(resJSON?.headers ?? {}).forEach((key) => {
        resHeaders[key] = resJSON.headers[key].length === 1
            ? resJSON.headers[key][0]
            : resJSON.headers[key];
      });
      var response = {
	data: resJSON.status ? globalThis.atob(resJSON.body.split(',').at(1)) : resJSON.body,
        status: resJSON.status,
        statusText: http.STATUS_CODES[resJSON.status] ?? '',
        headers: resHeaders,
        config,
        request: {
          responseURL: encodeURI(
            resJSON.status.toString().startsWith('3') && resJSON.headers && resJSON.headers.Location
              ? resJSON.headers.Location[0]
              : resJSON.target
          ),
        },
      };
      const validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) return response
      else throw new axios.AxiosError(
        "Request failed with status code " + response.status,
        [axios.AxiosError.ERR_BAD_REQUEST, axios.AxiosError.ERR_BAD_RESPONSE][
          Math.floor(response.status / 100) - 4
        ],
        response.config,
        response.request,
        response
      )    
  };
}

export { DEFAULT_CLIENT_ID, DEFAULT_HEADERS, DEFAULT_HEADER_ORDER };
