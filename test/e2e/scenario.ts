import glob = require("glob");
import path = require("path");
import jsonMerger = require("json-merger");
import {
  IIncludeData,
  IServerData,
  IUserData,
} from "./page-objects/interface-po";

/**
 * Schema of test scenario configuration files.
 */
export interface IServerScenarioSchema {
  /**
   * The server type.
   */
  serverType:
    | "totvs_server_protheus"
    | "totvs_server_logix"
    | "totvs_server_totvstec";
  /**
   * Short name to identify the server.
   */
  serverName: string;
  /**
   * IP address ou server address with appServer.
   */
  address: string;
  /**
   * SmartCLient port to connect.
   */
  port: number;
  /**
   * AppServer runtime environment.
   */
  environment: string;
  /**
   * List of environments that can be used in tests.
   */
  environments?: string[];
  /**
   * Folders for lookup define files (.ch). One per line.
   */
  includePath: string[];
  /**
   * Dekstop Smart Client Executable for debugger.
   */
  smartClientBin: string;
}

export interface IUserDataScenarioSchema {
  /**
   * User name identifier.
   */
  username: string;
  /**
   * Password.
   */
  password: string;
}

export interface IIncludeScenarioSchema {
    /**
     * Valid folders for update 'includePath' propertie. One per line.
     */
    toChange: string[];
    /**
     * Valid folders for add in 'includePath' propertie. One per line.
     */
    toAdd: string[];
  };

export interface ICompileKeyScenarioSchema {
    machineId: string;
  compileKeyFile: string;
  key: string;
  generatedIn: string;
  expireIn: string;
  token: string;
  overwrite: string;
}

export interface ITestScenarioSchema {
  /**
   * Short name to identify the test objective or target.
   */
  name: string;
  /**
   * Long description the test objective or target.
   */
  description: [string, ...string[]];
  /**
   * List of substitution variables.
   */
  variables: {
    [k: string]: OperationSystens;
  };
  /**
   * Server definition to connect.
   */
  server: IServerScenarioSchema;
  /**
   * Users credentials for connect.
   */
  users?: {
    /**
     * User like Administrator credential.
     */
    admin: IUserDataScenarioSchema;
    /**
     * User credential.
     */
    user: IUserDataScenarioSchema;
    /**
     * Invalid User credential.
     */
    invalid: IUserDataScenarioSchema;
  };
  /**
   * Folders for lookup define files (.ch). Used only for editing tests and do not need exist. One per line.
   */
  includePath?: IIncludeScenarioSchema;
  /**
   * Compile key for appServer. Format {"<id>": "<key>"}.
   */
  compileKey?: ICompileKeyScenarioSchema;
  /**
   * RPO Token for appServer Harpia
   */
  rpoToken?: {
    [k: string]: string;
  };
  /**
   * Folder with patch files.
   */
  patchFolder?: string;
  /**
   * Folder with templates files.
   */
  templatesFolder?: string;
  /**
   * Folder with source and resource files.
   */
  projectFolder?: string;
  /**
   * Folder with TDS Replay files.
   */
  replayFolder?: string;
}
/**
 * Associate value to be used according to the operating system.
 */
export interface OperationSystens {
  windows: string;
  linux: string;
  mac: string;
}

const TEST_RESOURCE = path.join(__dirname, "..", "..", "test", "resources");
const scenarioDefault: string = path.join(
  TEST_RESOURCE,
  "scenario",
  "default.scenario.json"
);

let values: ITestScenarioSchema;
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

// Processa variáveis de substitução
procSubstitutionVariable(values);

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

export const SCENARIO = values;

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
