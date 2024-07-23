import * as vscode from "vscode";
import {
  debug,
  DebugConfiguration,
  DebugSession,
  Disposable,
  extensions,
  QuickInputButton,
  QuickPick,
  QuickPickItem,
  Uri,
  window,
  l10n
} from "vscode";
import { statSync, chmodSync } from "fs";
import Utils, { LaunchConfig, MESSAGE_TYPE } from "../utils";
import * as path from "path";

const RESOURCES_FOLDER = path.join(__filename, "..", "..", "..", "resources");

//let isTableSyncEnabled = false;
let debugSession: DebugSession | undefined;
let dapArgs: string[] = [];

export function getDAP() {
  let pathDAP = "";
  let ext = extensions.getExtension("TOTVS.tds-vscode");
  if (ext) {
    if (process.platform === "win32") {
      pathDAP = path.join(
        ext.extensionPath,
        "/node_modules/@totvs/tds-da/bin/windows/debugAdapter.exe"
      );
    } else if (process.platform === "linux") {
      pathDAP = path.join(
        ext.extensionPath,
        "/node_modules/@totvs/tds-da/bin/linux/debugAdapter"
      );
      if (statSync(pathDAP).mode !== 33261) {
        chmodSync(pathDAP, "755");
      }
    } else if (process.platform === "darwin") {
      pathDAP = path.join(
        ext.extensionPath,
        "/node_modules/@totvs/tds-da/bin/mac/debugAdapter"
      );
      if (statSync(pathDAP).mode !== 33261) {
        chmodSync(pathDAP, "755");
      }
    }
  }

  return { command: pathDAP, args: dapArgs };
}

export function setDapArgs(dapArgs_: string[]) {
  dapArgs = dapArgs_;
}

export class ProgramArgs {
  program: string;
  args: string[] = [];

  constructor(program: string, args: string[]) {
    this.program = program;
    this.args = args;
  }
}

class QuickPickProgram implements QuickPickItem {
  label: string;
  args: string[] = [];

  constructor(program: string, args: string[]) {
    this.label = program;
    this.setArgs(args);
  }

  public setArgs(args: string[]) {
    this.args = args;
  }

  get description(): string {
    return this.args ? `(${this.args.map((element) => {
      // se um argumento contiver ',' ele devolve o argumento entre aspas para facilitar a visualização.
      if (element && element.indexOf(',') > 0)
        return "\"" + element + "\"";
      else
        return element;
    })
      .join(", ")})` : "<nil>";
  }
}

export async function getProgramName(
  _config: DebugConfiguration
): Promise<string> {
  const disposables: Disposable[] = [];

  let lastProgramExecuted = LaunchConfig.lastProgramExecuted() || "";
  lastProgramExecuted = (lastProgramExecuted == "<cancel>") ? "" : lastProgramExecuted;
  let lastPrograms: QuickPickProgram[] = [];

  if (LaunchConfig.lastPrograms()) {
    lastPrograms = LaunchConfig.lastPrograms().map((element: any) => {
      return new QuickPickProgram(element.label, element.args);
    });
  }

  let programArgs: ProgramArgs = undefined;

  try {
    await new Promise<ProgramArgs>((resolve, reject) => {
      const cancelButton: QuickInputButton = {
        iconPath: {
          dark: Uri.file(path.join(RESOURCES_FOLDER, "dark", "cancel.png")),
          light: Uri.file(path.join(RESOURCES_FOLDER, "light", "cancel.png")),
        },
        tooltip: l10n.t("Cancel Debug "),
      };

      const qp: QuickPick<QuickPickProgram> =
        window.createQuickPick<QuickPickProgram>();

      qp.title = l10n.t("Please enter the name of an AdvPL/4GL function");
      qp.items = lastPrograms;
      qp.value = lastProgramExecuted;
      qp.placeholder = qp.title;
      qp.matchOnDescription = true;
      qp.ignoreFocusOut = true;
      qp.buttons = [cancelButton];
      qp.canSelectMany = false;

      disposables.push(
        qp.onDidHide(() => {
          qp.hide();
          programArgs = new ProgramArgs("<cancel>", []);
          resolve(programArgs);
        }),
        qp.onDidTriggerButton((e: QuickInputButton) => {
          qp.hide();
          programArgs = new ProgramArgs("<cancel>", []);
          resolve(programArgs);
        }),
        qp.onDidChangeSelection((selection) => {
          programArgs = new ProgramArgs(selection[0].label, selection[0].args);
          resolve(programArgs);
        }),
        qp.onDidAccept(() => {
          // se vier de uma seleção 'programArgs' virá preenchido
          // senão analisa o input do usuário 'qp.value'
          if (!programArgs) {
            programArgs = extractProgramArgs(qp.value);
          }
          resolve(programArgs);
        })
      );

      disposables.push(qp);

      qp.show();
    });
  } finally {
    disposables.forEach((d) => d.dispose());
  }

  if (programArgs && programArgs.program !== "<cancel>") {
    const find: boolean = LaunchConfig.lastPrograms().some(
      (element: QuickPickProgram) => {
        return (
          element.label.toLowerCase() === programArgs.program.toLowerCase() &&
          JSON.stringify(element.args) === JSON.stringify(programArgs.args)
        );
      }
    );

    if (!find) {
      LaunchConfig.lastProgramsAdd(
        new QuickPickProgram(programArgs.program, programArgs.args)
      );
    }
  }

  // add modal dialog confirmation warning for debugging using SIGAMDI or SIGAADV
  if (!_config.noDebug && (programArgs.program.toUpperCase() === 'SIGAMDI' || programArgs.program.toUpperCase() === 'SIGAADV')) {
    const textYes = vscode.l10n.t("Yes");
    const textQuestion = vscode.l10n.t("Debugging using SIGAMDI or SIGAADV may result in unexpected behavior, instead use the modules directly. Do you want to continue?");
    const warnDialog = await vscode.window.showWarningMessage(textQuestion, { modal: true }, textYes);
    if (warnDialog !== textYes) {
      return "<cancel>";
    }
  }

  LaunchConfig.saveLastProgram(programArgs.program, programArgs.args);

  return `${programArgs.program}${programArgs.args ? ("(" + programArgs.args.map((element) => { if (element.indexOf(',') > 0) return "\"" + element + "\""; else return element; }).join(", ") + ")") : ""}`;
}

const programArgsRegex = /([^()]*)(\(.*\))*/i;

export function extractProgramArgs(value: string): ProgramArgs {
  let programArgs: ProgramArgs;

  if (value) {
    let testRegex = value.trim().match(programArgsRegex);
    if (testRegex && testRegex[0]) {
      let args: string[];
      // se houver match verifica se tem match na 3a posicao opcional "()"
      if (testRegex.length == 3 && testRegex[2]) {
        args = extractArgs(testRegex[2]);
      }
      programArgs = new ProgramArgs(testRegex[1], args);
    } else {
      programArgs = new ProgramArgs("<cancel>", []);
    }
  }
  return programArgs;
}

function extractArgs(value: string): string[] {
  let args: string[];
  if (value) {
    value = value.trim();
    if (value.length >= 2) {
      args = [];
      // remove apenas o 1o e ultimo caracter que deveriam ser os parênteses
      value = value.substring(1, value.length - 1).trim();
      if (value.length > 0) {
        let splited: string[];
        if (value.toLowerCase().indexOf("-a=") >= 0) {
          splited = value.split(/\s/);
          splited.forEach((element) => {
            if (element.length > 0) {
              element = element.replace("-a=", "").replace("-A=", "").trim();
              if (element.length == 0) {
                element = undefined;
              } else if (
                element.length > 1 &&
                ((element.startsWith('"') && element.endsWith('"')) ||
                  (element.startsWith("'") && element.endsWith("'")))
              ) {
                element = element.substring(1, element.length - 1);
              }
              args.push(element);
            }
          });
        } else {
          splited = value.split(",");
          while (splited.length > 0) {
            var element = splited.shift();
            element = element.trim();
            if (element.length == 0) {
              element = undefined;
            } else if (
              element.length > 1 &&
              ((element.startsWith('"') && element.endsWith('"')) ||
                (element.startsWith("'") && element.endsWith("'")))
            ) {
              element = element.substring(1, element.length - 1);
            } else if (
              element.length > 1 &&
              ((element.startsWith('"') && !element.endsWith('"')) ||
                (element.startsWith("'") && !element.endsWith("'")))
            ) {
              var startChar = element.charAt(0); // salva tipo de aspas antes de remover
              element = element.substring(1); // remove 1a aspas
              while (splited.length > 0) {
                var newElement = splited.shift();
                element += ("," + newElement); // recoloca o token "," splitado incorretamente
                if (element.length > 1 && element.endsWith(startChar)) {
                  element = element.substring(0, element.length - 1); // remove ultima aspas
                  break;
                }
              }
            }
            args.push(element);
          }
        }
      }
    }
  }
  return args;
}

export async function getProgramArguments(config: DebugConfiguration) {
  var argsJson = await pickProgramArguments(config);

  return argsJson;
}

function automaticLauncher(fileReplay: string, importOnlySource: boolean): DebugConfiguration {
  return {
    request: "launch",
    type: "totvs_tdsreplay_debug",
    name: "automatic-launcher",
    tdsReplayFile: fileReplay,
    includeSources: "*",
    excludeSources: "",
    importOnlySourcesInfo: importOnlySource,
    forceImport: true,
    //waitForAttach: 30000,
  };
}

export async function getReplayFile(config: DebugConfiguration) {
  const options: vscode.OpenDialogOptions = {
    canSelectMany: false,
    canSelectFiles: true,
    canSelectFolders: false,
    // defaultUri: selectionProps.fileSystem
    //   ? vscode.Uri.parse(`${selectionProps.fileSystem}:///${selectionProps.currentFolder}`)
    //   : vscode.Uri.file(selectionProps.currentFolder),
    title: vscode.l10n.t("Select a file to replay"),
    openLabel: vscode.l10n.t("Select"),
    filters: {
      "TDS Replay": ["trplay"],
      "All files": ["*"],
    },
  };

  const result = await vscode.window.showOpenDialog(options).then((fileUri) => {
    return fileUri ? fileUri[0].fsPath : undefined;
  });

  return result;
}

export function launcherReplayFile(replayFile: string) {
  const replayUri: vscode.Uri = vscode.Uri.parse(replayFile);
  const workspaceFolder: vscode.WorkspaceFolder = vscode.workspace.getWorkspaceFolder(replayUri);

  debug.startDebugging(workspaceFolder, {
    ...automaticLauncher(replayFile, false),
    "cwb": replayUri.fsPath
  })
    .then((result: boolean) => {
      if (!result) {
        vscode.window.showErrorMessage(l10n.t("There was an error in the importation of the file. See log for more details."));
      }
    });
}

export function prepareReplayFile(replayFile: string) {
  const replayUri: vscode.Uri = vscode.Uri.parse(replayFile);
  const workspaceFolder: vscode.WorkspaceFolder = vscode.workspace.getWorkspaceFolder(replayUri);

  debug.startDebugging(workspaceFolder, { ...automaticLauncher(replayFile, true), "cwb": replayUri.fsPath })
    .then((result: boolean) => {
      if (!result) {
        vscode.window.showErrorMessage(l10n.t("There was an error in the importation of the file. See log for more details."));
      }
    });
}

export function toggleTableSync() {
  if (debugSession !== undefined) {
    let isTableSyncEnabled = !LaunchConfig.isTableSyncEnabled(debugSession);
    sendChangeTableSyncSetting(isTableSyncEnabled);
    LaunchConfig.saveIsTableSyncEnabled(debugSession, isTableSyncEnabled);
    if (isTableSyncEnabled) {
      Utils.logMessage(l10n.t("Tables synchronism enabled"),
        MESSAGE_TYPE.Info,
        true
      );
    } else {
      Utils.logMessage(l10n.t("Tables synchronism disabled"),
        MESSAGE_TYPE.Info,
        true
      );
    }
  } else {
    Utils.logMessage(
      l10n.t("The command to Disable/Enable the table synchronism needs an active debug session. For an initial configuration, please change the file launch.json manually"),
      MESSAGE_TYPE.Error,
      true
    );
  }
}

debug.onDidChangeActiveDebugSession((newDebugSession: DebugSession | undefined) => {
  debugSession = newDebugSession;
});

function sendChangeTableSyncSetting(isTableSyncEnabled: boolean): void {
  if (debugSession === undefined) {
    debugSession = debug.activeDebugSession;
  }
  if (debugSession !== undefined) {
    const settingsArray = [
      { key: "enableTableSync", value: isTableSyncEnabled },
    ];
    const arg = { settings: settingsArray };

    debugSession
      .customRequest("$changeSettings", arg)
      .then((value: any) => {
        //let status = isTableSyncEnabled ? localize('tds.debug.tableSync.satus.enabled',"enabled") : localize('tds.debug.tableSync.satus.disabled',"disabled");
        //Utils.logMessage(localize('tds.debug.tableSync.satus',`Tables synchronism ${status}`) , MESSAGETYPE.Info, true);
      })
      .then(undefined, (err) => {
        console.error(err.message);
        Utils.logMessage(err.message, MESSAGE_TYPE.Error, true);
      });
  }
}

interface IExtendFeatures {
  charDetails: boolean
}

async function pickProgramArguments(
  _config: DebugConfiguration
): Promise<string | undefined> {
  const disposables: Disposable[] = [];

  let lastProgramExecuted = LaunchConfig.lastProgramExecuted() || "";
  if (lastProgramExecuted == "<cancel>") {
    return undefined;
  }
  let lastArgumentsExecuted = LaunchConfig.lastProgramArguments()
    ? LaunchConfig.lastProgramArguments()
    : []

  let lastPrograms: QuickPickProgram[] = LaunchConfig.lastPrograms()
    .filter((element: QuickPickProgram) => {
      return (
        element.label.toLowerCase() === lastProgramExecuted.toLowerCase() &&
        element.args
      );
    })
    .map((element: any) => {
      return new QuickPickProgram(element.program, element.args);
    });

  let selectArgs: string[] = [];

  try {
    const cancelButton: QuickInputButton = {
      iconPath: {
        dark: Uri.file(path.join(RESOURCES_FOLDER, "dark", "cancel.png")),
        light: Uri.file(path.join(RESOURCES_FOLDER, "light", "cancel.png")),
      },
      tooltip: l10n.t("Cancel Debug "),
    };

    await new Promise<void>((resolve, reject) => {
      const qp: QuickPick<QuickPickProgram> =
        window.createQuickPick<QuickPickProgram>();
      qp.title = l10n.t("Enter comma-separated list of arguments");
      qp.items = lastPrograms;
      qp.placeholder = l10n.t("Enter comma-separated list of arguments");
      qp.ignoreFocusOut = true;
      qp.canSelectMany = false;
      qp.buttons = [cancelButton];
      qp.value = lastArgumentsExecuted?.join(", ");

      disposables.push(
        qp.onDidHide(() => {
          qp.hide();
          selectArgs = ["<cancel>"];
          resolve();
        }),
        qp.onDidTriggerButton((e: QuickInputButton) => {
          qp.hide();
          selectArgs = ["<cancel>"];
          resolve();
        }),
        qp.onDidChangeSelection((selection) => {
          if (selection[0]) {
            selectArgs = selection[0].args;
            resolve();
          }
        }),
        qp.onDidAccept((e) => {
          const program = lastProgramExecuted;

          if (!selectArgs || selectArgs.length == 0) {
            selectArgs = extractArgs(qp.value);
          }
          if (selectArgs) {
            const find: boolean = LaunchConfig.lastPrograms().some(
              (element: QuickPickProgram) => {
                return (
                  element.label.toLowerCase() ===
                  lastProgramExecuted.toLowerCase() &&
                  JSON.stringify(element.args) === JSON.stringify(selectArgs)
                );
              }
            );

            if (!find) {
              LaunchConfig.lastProgramsAdd(
                new QuickPickProgram(program, selectArgs)
              );
            }
            // config.lastProgramArguments = selectArgs;
            // Utils.saveLaunchConfig(config);
            LaunchConfig.saveLastProgram(undefined, selectArgs);
            resolve();
          }
        })
      );

      disposables.push(qp);

      qp.show();
    });
  } finally {
    disposables.forEach((d) => d.dispose());
  }

  return JSON.stringify(selectArgs);
  //return selectArgs.join(", ");
}
