declare let DEFAULT_CLIENT_ID: string;
declare let DEFAULT_HEADERS: {
    accept: string;
    "accept-encoding": string;
    "accept-language": string;
    "sec-ch-ua": string;
    "sec-ch-ua-mobile": string;
    "sec-ch-ua-platform": string;
    "sec-fetch-dest": string;
    "sec-fetch-mode": string;
    "sec-fetch-site": string;
    "sec-fetch-user": string;
    "user-agent": string;
};
declare let DEFAULT_HEADER_ORDER: string[];
export declare function createAdapter(_config: any): (config: any) => Promise<unknown>;
export { DEFAULT_CLIENT_ID, DEFAULT_HEADERS, DEFAULT_HEADER_ORDER };
