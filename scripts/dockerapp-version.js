#!/usr/bin/env node

const fs = require("fs");
const pack = require("../lerna.json");

const { version } = pack;

const fullPath = p => __dirname + "/" + p;

const readFile = path => fs.readFileSync(fullPath(path)).toString();

const updateFile = (path, updater) => {
  const file = readFile(path);
  const result = updater(file);
  fs.writeFileSync(fullPath(path), result);
};

const checkFile = (path, validator) => {
  const file = readFile(path);
  const valid = validator(file);
  if (!valid) {
    process.exit(1);
  }
};

const metadataVersionRegex = /(?<=version: ).*$/gm;
const apiVersionRegex = /(?<=API_VERSION: ).*$/gm;
const uiVersionRegex = /(?<=UI_VERSION: ).*$/gm;
const nginxProxyVersionRegex = /(?<=NGINX_PROXY_VERSION: ).*$/gm;

const METADATA_FILE = "../ente.dockerapp/metadata.yml";
const SETTINGS_FILE = "../ente.dockerapp/settings.yml";

const update = () => {
  updateFile(METADATA_FILE, s => s.replace(metadataVersionRegex, version));

  updateFile(SETTINGS_FILE, s => {
    let result = s;
    const replace = regex => (result = result.replace(regex, version));
    replace(apiVersionRegex);
    replace(uiVersionRegex);
    replace(nginxProxyVersionRegex);
    return result;
  });
};

const check = () => {
  checkFile(METADATA_FILE, f => {
    const [match] = f.match(metadataVersionRegex);
    return match === version;
  });

  checkFile(SETTINGS_FILE, f => {
    const check = regex => f.match(regex)[0] === version;
    return (
      check(uiVersionRegex) &&
      check(apiVersionRegex) &&
      check(nginxProxyVersionRegex)
    );
  });
};

const cmd = process.argv[2];
switch (cmd) {
  case "check":
    check();
    break;
  case "update":
    update();
    break;
}
