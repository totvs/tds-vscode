import { readJsonSync } from "fs-extra";
import path = require("path");
import jsonMerger = require("json-merger");
import {
  IIncludeData,
  IServerData,
  IUserData,
} from "./page-objects/interface-po";

const TEST_RESOURCE = path.join(__dirname, "..", "..", "test", "resources");
const scenarioDefault: string = path.join(
  TEST_RESOURCE,
  "scenario",
  "default.json"
);
let values: any;
let scenarioFile: string = scenarioDefault;

if (process.env.SCENARIO) {
  scenarioFile = path.join(
    TEST_RESOURCE,
    "scenario",
    process.env.SCENARIO.trim()
  );

  values = jsonMerger.mergeFiles([scenarioDefault, scenarioFile]);
} else {
  values = readJsonSync(scenarioDefault);
}

console.log("--------------------------------------");
console.log(`Using: ${values.name} (${path.basename(scenarioFile)})`);
console.log(`\t${values.description.join("\n\t")}`);
console.log("--------------------------------------");

export const APPSERVER_DATA: IServerData = values.server;

export const DELETE_DATA: IServerData = {
  ...APPSERVER_DATA,
  serverName: "forDelete",
};

export const ADMIN_USER_DATA: IUserData = values.users.admin;

export const NO_ADMIN_USER_DATA: IUserData = values.users.user;

export const INVALID_USER_DATA: IUserData = values.users.invalid;

export const INCLUDE_PATH_DATA: IIncludeData = values.includePath;

export const COMPILE_KEY_FILE = {};

Object.keys(values.compileKey).forEach((key: string) => {
  COMPILE_KEY_FILE[key] = path.join(
    TEST_RESOURCE,
    "compile-key",
    values.compileKey[key]
  );
});
