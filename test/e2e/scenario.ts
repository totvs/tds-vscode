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
  "default.scenario.json"
);
let values: any;
let valuesFile: any;
let scenarioFile: string = scenarioDefault;

if (process.env.SCENARIO) {
  scenarioFile = path.join(
    TEST_RESOURCE,
    "scenario",
    process.env.SCENARIO.trim() + ".scenario.json"
  );

  const valuesDefault = jsonMerger.mergeFiles([scenarioDefault]);
  valuesFile = jsonMerger.mergeFiles([scenarioFile]);
  values = jsonMerger.mergeObjects([valuesDefault, valuesFile]);
  values.description = valuesFile.description;
} else {
  values = jsonMerger.mergeFiles([scenarioFile]);
}

console.log("--------------------------------------");
console.log(`Scenario: ${values.name} (${path.basename(scenarioFile)})`);
console.log(`\t${values.description.join("\n\t")}`);

if (valuesFile) {
  // Processa variáveis de substitução
  procSubstitutionVariable(valuesFile);

  console.log(JSON.stringify(valuesFile, null, "  "));
}
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

export const RPO_CUSTOM: string =
  "M:/protheus/apo.p20.12.1.33/custom/custom.rpo";
export const RPO_FOLDER: string = "M:/protheus/apo.p20.12.1.33/";
export const RPO_RESET_SOURCE: string = "tttm120 - original.rpo";
export const RPO_RESET_TARGET: string = "tttm120.rpo";
// path.join(
// TEST_RESOURCE,
// "patchs",
// values.patchFolder
//);

const templateFolder: string = path.join(
  TEST_RESOURCE,
  "templates",
  values.templatesFolder
);

const patchFiles: string[] = getFileParams(patchFolder, true);
export const PATCHS_FILES = {
  single: patchFiles["single"] ? patchFiles["single"][0] : undefined,
  many: patchFiles["many"],
  zip: patchFiles["zip"],
  invalid: patchFiles["invalid"],
};

const templateFiles: string[] = getFileParams(templateFolder, true);
export const TEMPLATE_FILES = templateFiles ? { ...templateFiles } : undefined;

export const PROJECT_FOLDER = path.join(
  TEST_RESOURCE,
  "projects",
  values.projectFolder
);

const sourceFiles: string[] = getFileParams(PROJECT_FOLDER, false);
export const COMPILE_FILES = {
  singleFile: sourceFiles["singleFile"].length
    ? sourceFiles["singleFile"][0].split("/")
    : null,
  userFunctions: sourceFiles["userFunction"],
  functions: sourceFiles["function"],
  resources: sourceFiles["resource"],
  sourcesWithError: sourceFiles["withError"],
};

const replayFolder: string = path.join(TEST_RESOURCE, values.replayFolder);
const replayFiles: string[] = getFileParams(replayFolder, true);
export const REPLAY_FILES = Object.keys(replayFiles).length
  ? replayFiles
  : null;

Object.keys(values.compileKey).forEach((key: string) => {
  COMPILE_KEY_FILE[key] = path.join(
    TEST_RESOURCE,
    "compile-key",
    values.compileKey[key]
  );
});

// Processa variáveis de substitução
procSubstitutionVariable(values);

// Processa variáveis de substitução
function procSubstitutionVariable(object: any) {
  Object.keys(values.variables).forEach((variable: string) => {
    const value: string = valueByOS(variable);

    Object.keys(object).forEach((key: string) => {
      const element = object[key];

      if (typeof element !== "string") {
        procSubstitutionVariable(object[key]);
      } else {
        object[key] = object[key].replaceAll(`\${${variable}}`, value);
      }
    });
  });
}

function valueByOS(name: string): string {
  let result: string = name;

  if (process.platform === "win32") {
    result = values.variables[name].windows;
  } else if (process.platform === "linux") {
    result = values.variables[name].linux;
  } else if (process.platform === "darwin") {
    result = values.variables[name].mac;
  }

  return result;
}

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
