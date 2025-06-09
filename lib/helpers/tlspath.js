"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTLSDependencyPath = void 0;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const arch = os_1.default.arch();
const platform = os_1.default.platform();
let version = "1.9.1";
let filename, extension, distribution;
if (platform === "win32") {
    filename = "tls-client-windows";
    extension = "dll";
    distribution = arch.includes("64") ? "64" : "32";
}
else if (platform === "darwin") {
    filename = "tls-client-darwin";
    extension = "dylib";
    distribution = arch == "arm64" ? arch : "amd64";
}
else if (platform === "linux") {
    filename = "tls-client-linux";
    extension = "so";
    let releaseDetails = fs_1.default.readFileSync("/etc/os-release", "utf8");
    const lines = releaseDetails.split("\n");
    const release = {};
    lines.forEach((line, _) => {
        // Split the line into an array of words delimited by '='
        const words = line.split("=");
        if (words.length !== 2) {
            return;
        }
        release[words[0].trim().toLowerCase()] = words[1].trim();
    });
    if (release.id.toLowerCase().includes("ubuntu")) {
        distribution = "ubuntu-amd64";
    }
    else if (release.id.toLowerCase().includes("alpine")) {
        distribution = `alpine-amd64`;
    }
    else {
        distribution = arch == "arm64" ? arch : "armv7";
    }
}
else {
    console.error(`Unsupported platform: ${platform}`);
    process.exit(1);
}
let _filename = `${filename}-${distribution}-v${version}.${extension}`;
const url = `https://github.com/bogdanfinn/tls-client/releases/download/v${version}/${_filename}`;
const destination = `${os_1.default.tmpdir()}/${_filename}`;
function getTLSDependencyPath() {
    return {
        DOWNLOAD_PATH: url,
        TLS_LIB_PATH: destination,
    };
}
exports.getTLSDependencyPath = getTLSDependencyPath;
