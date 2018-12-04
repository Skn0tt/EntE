#! /usr/bin/env ts-node
import * as fs from "fs";
import * as hbs from "handlebars";
import * as mkdirp from "mkdirp";
import data from "./data";
import * as replaceall from "replaceall";

const templateString = fs.readFileSync("./templates/index.hbs", "utf8");
console.log("Read template");

const template = hbs.compile(templateString);
console.log("Compiled template");

const getDir = (s: string) => s.slice(0, s.lastIndexOf("/"));

const render = (
  context: any,
  path: string,
  modify: (s: string) => string = s => s
) => {
  const result = template(context);
  console.log(`Generated ${path}`);

  const modified = modify(result);

  mkdirp.sync(getDir(path));
  fs.writeFileSync(path, modified, { encoding: "utf8" });
  console.log(`Wrote ${path}`);
};

render(data.en, "./en/index.html");
render(data.de, "./de/index.html");
render(data.de, "./index.html", s => replaceall('"../', '"./', s));
