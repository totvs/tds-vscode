import { readJsonSync } from "fs-extra";
import path = require("path");
import jsonMerger = require("json-merger");
import {
  IIncludeData,
  IServerData,
  IUserData,
} from "./page-objects/interface-po";
import * as glob from "glob";

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

const patchFolder: string = path.join(
  TEST_RESOURCE,
  "patchs",
  values.patchFolder
);

const singlePatchFile: string[] = [];
const manyPatchFile: string[] = [];
const zipPatchFile: string[] = [];

glob.sync("**/**.*", { cwd: patchFolder,  }).forEach((file: string) => {
  if (file.includes("zip")) {
    zipPatchFile.push(path.join(patchFolder, file));
  } else if (file.includes("single")) {
    singlePatchFile.push(path.join(patchFolder, file));
  } else {
    manyPatchFile.push(path.join(patchFolder, file));
  }
});

if ((singlePatchFile.length == 0)) {
  console.warn("'Single' folder contains no file. Test will be skipped.");
} else if (singlePatchFile.length > 1) {
  console.warn(
    "'Single' folder contains more than one file. Only the first will be used."
  );
}

if (!(manyPatchFile.length > 1)) {
  console.warn(
    "The 'Many' folder contains one or no files. Test will be skipped."
  );
}

if ((zipPatchFile.length == 0)) {
  console.warn("'Zip' folder contains no file. Test will be skipped.");
}

export const PATCHS_FILES = {
  single: singlePatchFile[0],
  many: manyPatchFile,
  zip: manyPatchFile,
};

Object.keys(values.compileKey).forEach((key: string) => {
  COMPILE_KEY_FILE[key] = path.join(
    TEST_RESOURCE,
    "compile-key",
    values.compileKey[key]
  );
});
