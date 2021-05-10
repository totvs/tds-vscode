import {
  debug,
  DebugSession,
  Disposable,
  extensions,
  QuickPick,
  QuickPickItem,
  window,
} from 'vscode';
import { statSync, chmodSync } from 'fs';
import Utils, { MESSAGETYPE } from '../utils';
import * as path from 'path';
import * as nls from 'vscode-nls';

const localize = nls.loadMessageBundle();

let isTableSyncEnabled = false;
let debugSession: DebugSession | undefined;
let dapArgs: string[] = [];

export function getDAP() {
  let pathDAP = '';
  let ext = extensions.getExtension('TOTVS.tds-vscode');
  if (ext) {
    if (process.platform === 'win32') {
      pathDAP = path.join(
        ext.extensionPath,
        '/node_modules/@totvs/tds-da/bin/windows/debugAdapter.exe'
      );
    } else if (process.platform === 'linux') {
      pathDAP = path.join(
        ext.extensionPath,
        '/node_modules/@totvs/tds-da/bin/linux/debugAdapter'
      );
      if (statSync(pathDAP).mode !== 33261) {
        chmodSync(pathDAP, '755');
      }
    } else if (process.platform === 'darwin') {
      pathDAP = path.join(
        ext.extensionPath,
        '/node_modules/@totvs/tds-da/bin/mac/debugAdapter'
      );
      if (statSync(pathDAP).mode !== 33261) {
        chmodSync(pathDAP, '755');
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
  description: string;
  args: string[] = [];

  constructor(program: string, args: string[]) {
    this.label = program;
    this.setArgs(args);
  }

  public setArgs(args: string[]) {
    this.args = args;
    this.description = this.args ? this.args.join(',') : '<nil>';
  }
}

export async function getProgramName() {
  const disposables: Disposable[] = [];

  let config = undefined;

  try {
    config = Utils.getLaunchConfig();
  } catch (e) {
    Utils.logInvalidLaunchJsonFile(e);
  }
  if (!config) {
    return undefined;
  }

  let lastProgramExecuted = config.lastProgramExecuted || '';
  let lastPrograms: QuickPickProgram[] = [];

  if (config.lastPrograms) {
    lastPrograms = config.lastPrograms;
  } else {
    config.lastPrograms = lastPrograms;
  }

  try {
    return await new Promise<ProgramArgs | undefined>((resolve, reject) => {
      const qp: QuickPick<QuickPickProgram> = window.createQuickPick<QuickPickProgram>();
      qp.title = localize(
        'tds.vscode.getProgramName',
        'Please enter the name of an AdvPL/4GL function'
      );
      qp.items = lastPrograms;
      qp.value = lastProgramExecuted;
      qp.matchOnDescription = true;
      qp.placeholder = localize(
        'tds.vscode.getProgramName',
        'Please enter the name of an AdvPL/4GL function'
      );

      disposables.push(
        qp.onDidChangeSelection((selection) => {
          resolve(new ProgramArgs(selection[0].label, selection[0].args));
          //qp.dispose();
        })
      );

      disposables.push(
        qp.onDidAccept((e) => {
          let programArgs: ProgramArgs = extractProgramArgs(qp.value);
          if (programArgs) {
            const find: boolean = config.lastPrograms.some(
              (element: QuickPickProgram) => {
                return (
                  element.label.toLowerCase() ===
                    programArgs.program.toLowerCase() &&
                  JSON.stringify(element.args) ===
                    JSON.stringify(programArgs.args)
                );
              }
            );
            if (!find) {
              config.lastPrograms.push(
                new QuickPickProgram(programArgs.program, programArgs.args)
              );
            }

            config.lastProgramExecuted = programArgs.program;

            Utils.saveLaunchConfig(config);
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
}

const programArgsRegex = /^([\w\.\-\_]+)(\(?[^)\n]*\)?)?/i;

export function extractProgramArgs(value: string): ProgramArgs {
  let programArgs: ProgramArgs;
  if (value) {
    let testRegex = value.trim().match(programArgsRegex);
    if (testRegex[0]) {
      let args: string[];
      if (testRegex.length >= 3 && testRegex[2]) {
        args = extractArgs(testRegex[2]);
      }
      programArgs = new ProgramArgs(testRegex[1], args);
    }
  }
  return programArgs;
}

function extractArgs(value: string): string[] {
  let args: string[];
  if (value) {
    value = value.trim();
    if (value.length > 0) {
      args = [];
      value = value.replace('(', '').replace(')', '').trim();
      if (value.length > 0) {
        let splited: string[];
        if (value.toLowerCase().indexOf('-a=') >= 0) {
          splited = value.split(/\s/);
          splited.forEach((element) => {
            if (element.length > 0) {
              element = element.replace('-a=', '').replace('-A=', '').trim();
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
          splited = value.split(/,/);
          splited.forEach((element) => {
            element = element.trim();
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
          });
        }
      }
    }
  }
  return args;
}

export async function getProgramArguments() {
  return await pickProgramArguments();
}

export function toggleTableSync() {
  if (debugSession !== undefined) {
    let launchConfig = undefined;

    try {
      launchConfig = Utils.getLaunchConfigFile();
      launchConfig.configurations.forEach((launchElement) => {
        if (
          debugSession !== undefined &&
          launchElement.name === debugSession.name
        ) {
          isTableSyncEnabled = !launchElement.enableTableSync;
          sendChangeTableSyncSetting();
          launchElement.enableTableSync = isTableSyncEnabled;
          if (isTableSyncEnabled) {
            Utils.logMessage(
              localize(
                'tds.debug.tableSync.enabled',
                'Tables synchronism enabled'
              ),
              MESSAGETYPE.Info,
              true
            );
          } else {
            Utils.logMessage(
              localize(
                'tds.debug.tableSync.disabled',
                'Tables synchronism disabled'
              ),
              MESSAGETYPE.Info,
              true
            );
          }
        }
      });
      Utils.saveLaunchConfig(launchConfig);
    } catch (e) {
      Utils.logInvalidLaunchJsonFile(e);
    }
  } else {
    Utils.logMessage(
      localize(
        'tds.debug.tableSync.disabled',
        'The command to (Dis)Enable the table synchronism needs an active debug session. For an initial configuration, please change the file launch.json manually'
      ),
      MESSAGETYPE.Error,
      true
    );
  }
}

debug.onDidChangeActiveDebugSession((newDebugSession) => {
  debugSession = newDebugSession;
});

function sendChangeTableSyncSetting(): void {
  if (debugSession === undefined) {
    debugSession = debug.activeDebugSession;
  }
  if (debugSession !== undefined) {
    const settingsArray = [
      { key: 'enableTableSync', value: isTableSyncEnabled },
    ];
    const arg = { settings: settingsArray };

    debugSession
      .customRequest('$changeSettings', arg)
      .then((value: any) => {
        //let status = isTableSyncEnabled ? localize('tds.debug.tableSync.satus.enabled',"enabled") : localize('tds.debug.tableSync.satus.disabled',"disabled");
        //Utils.logMessage(localize('tds.debug.tableSync.satus',`Tables synchronism ${status}`) , MESSAGETYPE.Info, true);
      })
      .then(undefined, (err) => {
        console.error(err.message);
        Utils.logMessage(err.message, MESSAGETYPE.Error, true);
      });
  }
}

async function pickProgramArguments() {
  const disposables: Disposable[] = [];

  let config = undefined;

  try {
    config = Utils.getLaunchConfig();
  } catch (e) {
    Utils.logInvalidLaunchJsonFile(e);
  }

  if (!config) {
    return undefined;
  }

  let lastProgramExecuted = config.lastProgramExecuted || '';
  let lastPrograms: QuickPickProgram[] = [];

  lastPrograms = config.lastPrograms.filter((element: QuickPickProgram) => {
    return (
      element.label.toLowerCase() === lastProgramExecuted.toLowerCase() &&
      element.args
    );
  });

  // lastPrograms.forEach((element) => {
  //   element.label = element.description;
  //   element.description = "";
  //   element.args = element.args;
  // });

  try {
    return await new Promise<string[] | undefined>((resolve, reject) => {
      const qp: QuickPick<QuickPickProgram> = window.createQuickPick<QuickPickProgram>();
      qp.title = localize(
        'tds.vscode.getProgramArguments',
        'Enter comma-separated list of arguments'
      );
      qp.items = lastPrograms;
      qp.placeholder = localize(
        'tds.vscode.getProgramArguments',
        'Enter comma-separated list of arguments'
      );

      disposables.push(
        qp.onDidChangeSelection((selection) => {
          if (selection[0]) {
            resolve(selection[0].args);
          }
        })
      );

      disposables.push(
        qp.onDidAccept((e) => {
          const program = lastProgramExecuted;
          //const description = qp.value.toLowerCase();

          let args: string[];
          if (qp.value) {
            args = extractArgs(qp.value);

            const find: boolean = config.lastPrograms.some(
              (element: QuickPickProgram) => {
                return (
                  element.label.toLowerCase() ===
                    lastProgramExecuted.toLowerCase() &&
                  JSON.stringify(element.args) === JSON.stringify(args)
                );
              }
            );

            if (!find) {
              config.lastPrograms.push(new QuickPickProgram(program, args));
              Utils.saveLaunchConfig(config);
            }
          }

          resolve(args);
        })
      );

      disposables.push(qp);

      qp.show();
    });
  } finally {
    disposables.forEach((d) => d.dispose());
  }
}
