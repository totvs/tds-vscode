import glob = require("glob");
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
  values = jsonMerger.mergeFiles([scenarioFile]);
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
const patchFiles: string[] = getFileParams(patchFolder, true);
export const PATCHS_FILES = {
  single: patchFiles["single"] ? patchFiles["single"][0] : undefined,
  many: patchFiles["many"],
  zip: patchFiles["zip"],
  invalid: patchFiles["invalid"],
};

export const PROJECT_FOLDER = path.join(
  TEST_RESOURCE,
  "projects",
  values.projectFolder
);

const sourceFiles: string[] = getFileParams(PROJECT_FOLDER, false);
export const COMPILE_FILES = {
  userFunctions: sourceFiles["userFunction"],
  functions: sourceFiles["function"],
  resources: sourceFiles["resource"],
  sourcesWithError: sourceFiles["withError"],
};

Object.keys(values.compileKey).forEach((key: string) => {
  COMPILE_KEY_FILE[key] = path.join(
    TEST_RESOURCE,
    "compile-key",
    values.compileKey[key]
  );
});

function getFileParams(patchFolder: string, absolute: boolean): any[] {
  const result: any[] = [];

  const files: string[] = glob.sync("**/**.*", {
    cwd: patchFolder,
    absolute: absolute,
  });

  for (const file of files) {
    const parentFolder: string = path.dirname(file);
    const folder: string = path.basename(parentFolder);

    result[folder] ? result[folder].push(file) : (result[folder] = [file]);
  }

  Object.keys(result).forEach((key: string) => {
    if (result[key].length == 0) {
      console.warn(
        `'${key}' folder does not contain files. Test will be skipped.`
      );
      result[key] = null;
    }
  });

  return result;
}
