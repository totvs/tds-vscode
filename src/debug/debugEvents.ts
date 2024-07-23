/*
Copyright 2021-2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as vscode from "vscode";
import * as fse from "fs-extra";
import {
  Breakpoint,
  BreakpointsChangeEvent,
  debug,
  DebugConsole,
  DebugSessionCustomEvent,
  ExtensionContext,
  ProgressLocation,
  window,
  commands,
  l10n,
} from "vscode";
import { TotvsConfigurationProvider } from "./TotvsConfigurationProvider";
import { TotvsConfigurationTdsReplayProvider } from "./TotvsConfigurationTdsReplayProvider";
import Utils, { groupBy, MESSAGE_TYPE } from "../utils";
import { LanguageClient } from "vscode-languageclient/node";
import { TotvsConfigurationWebProvider } from "./TotvsConfigurationWebProvider";
import { languageClient } from "../extension";
import { ReplayTimelineOptions, ReplayTimelinePanel } from "../panels/replayTimelinePanel";

const DEBUG_TYPE = TotvsConfigurationProvider._TYPE;
const WEB_DEBUG_TYPE: string = TotvsConfigurationWebProvider._TYPE;
const REPLAY_DEBUG_TYPE = TotvsConfigurationTdsReplayProvider._TYPE;

interface LogBody {
  time: string;
  level: string;
  notify: boolean;
  message: string;
}

let context: ExtensionContext;
export let createTimeLineWebView: ReplayTimelinePanel = null;

export class DebugEvent {
  constructor(pContext: ExtensionContext) {
    context = pContext;
    //vscode.debug.onDidTerminateDebugSession(event => {
    //});
  }
}

function instanceOfLogBody(object: any): object is LogBody {
  return "level" in object;
}

enum eLogLevelEvent {
  ellInformation = "INFO",
  ellWarning = "WARN",
  ellError = "ERROR",
  ellConsole = "CONSOLE",
}
const SPACES: string = " ".repeat(11);

export function processShowTimelineView(debugSession: vscode.DebugSession) {
  const options: ReplayTimelineOptions = {
    isIgnoreSourceNotFound: false,  //debugSession.configuration.ignoreSourcesNotFound,
    selectedSources: [], //debugEvent.session.configuration.selectedSources,
    //debugEvent: debugEvent,
    replayFile: "", //debugEvent.session.configuration.tdsReplayFile,
    debugSession: debug.activeDebugSession
  };

  createTimeLineWebView = ReplayTimelinePanel.render(context, options);
}

export function processEndDebug() {
  if (createTimeLineWebView !== undefined) {
    createTimeLineWebView.dispose();
    createTimeLineWebView = null;

    const tabGroups: vscode.TabGroups = vscode.window.tabGroups;
    tabGroups.all.forEach((tabGroup: vscode.TabGroup) => {
      if (tabGroup.tabs.length == 0) {
        tabGroups.close(tabGroup);
      }
    })
  };
}

export function processDebugCustomEvent(event: DebugSessionCustomEvent) {
  if (
    event.session.type.startsWith(DEBUG_TYPE) ||
    event.session.type.startsWith(WEB_DEBUG_TYPE) ||
    event.session.type.startsWith(REPLAY_DEBUG_TYPE)
  ) {
    const debugConsole = debug.activeDebugConsole;

    if (event.event === undefined) {
      return;
    }

    if (event.event === "TDA/log") {
      processLogEvent(event, debugConsole);
    } else if (event.event === "TDA/addTimeLine") {
      processAddTimeLineEvent(event, debugConsole);
    } else if (event.event === "TDA/selectTimeLine") {
      processSelectTimeLineEvent(event, debugConsole);
    } else if (event.event === "TDA/showProgress") {
      processShowProgressEvent(event, debugConsole);
    } else if (event.event === "TDA/showLoadingPageDialog") {
      //processShowLoadingDialogEvent(event, debugConsole);
    } else if (event.event === "TDA/showMsgDialog") {
      processShowMsgDialogEvent(event, debugConsole);
    } else if (event.event === "TDA/showSourcesView") {
      processShowSourcesView(event, debugConsole);
    } else {
      window.showWarningMessage("Evento desconhecido: " + event.event);
    }
  }
}

function processLogEvent(
  event: DebugSessionCustomEvent,
  debugConsole: DebugConsole
) {
  if (event.event === "TDA/log") {
    if (instanceOfLogBody(event.body)) {
      const body = event.body;
      const notify = body.notify;
      const level = body.level;
      const message = body.message !== undefined ? body.message.replace("\n", "\n" + SPACES) : "";
      const time = body.time;

      if (notify) {
        if (level === eLogLevelEvent.ellError) {
          window.showErrorMessage(message);
        } else if (level === eLogLevelEvent.ellInformation) {
          window.showInformationMessage(message);
        } else if (level === eLogLevelEvent.ellWarning) {
          window.showWarningMessage(message);
        }
      }

      if (level === eLogLevelEvent.ellConsole) {
        debugConsole.appendLine(`[${time}]      : ${message}`);
      } else {
        debugConsole.appendLine(`[${time}] ${level}: ${message}`);
        Utils.logMessage(
          `[${time}] ${level}: ${message}`,
          MESSAGE_TYPE.Info,
          true
        );
      }
    } else {
      debugConsole.appendLine("<evento desconhecido>");
      debugConsole.appendLine(JSON.stringify(event.event));
    }
  }
}

function processAddTimeLineEvent(
  debugEvent: DebugSessionCustomEvent,
  console: DebugConsole
) {
  const options: ReplayTimelineOptions = {
    isIgnoreSourceNotFound: debugEvent.session.configuration.ignoreSourcesNotFound,
    selectedSources: debugEvent.session.configuration.selectedSources,
    //debugEvent: debugEvent,
    replayFile: debugEvent.session.configuration.tdsReplayFile,
    debugSession: debug.activeDebugSession
  };

  createTimeLineWebView = ReplayTimelinePanel.render(context, options);

  // if (createTimeLineWebView === null) {
  //   createTimeLineWebView = new CreateTDSReplayTimeLineWebView(
  //     context,
  //     debugEvent,
  //     isIgnoreSourceNotFound,
  //     selectedSources
  //   );
  // } else {
  //   if (createTimeLineWebView.isDisposed()) {
  //     createTimeLineWebView.reveal();
  //   }

  // createTimeLineWebView.postAddTimeLineEvent(
  //   debugEvent,
  //   options.isIgnoreSourceNotFound,
  //   options.selectedSources
  // );

  createTimeLineWebView.revealData(debugEvent);
}

function processSelectTimeLineEvent(
  event: DebugSessionCustomEvent,
  debugConsole: DebugConsole
) {
  if (createTimeLineWebView !== null) {
    createTimeLineWebView.selectTimeLine(event.body.id);
  }
}

//let showProgressInfoEachPercent: number = 2;
let progressStarted: boolean = false;
let isFinished: boolean = false;
let messageQueue: Array<{ message; percent; increment }> = new Array<{
  message;
  percent;
  increment;
}>();

function processShowProgressEvent(
  event: DebugSessionCustomEvent,
  debugConsole: DebugConsole
) {
  const message: string = `${event.body.detailMessage} ( ${event.body.currentWork}% )`;
  messageQueue.push({
    message: message,
    percent: event.body.currentWork,
    increment: event.body.increment,
  });

  isFinished = !(
    event.body.currentWork < 100 &&
    !event.body.detailMessage.includes("[ERROR]")
  );

  if (!progressStarted) {
    progressStarted = true;

    debug.onDidTerminateDebugSession((event) => {
      isFinished = true;
      progressStarted = false;
      clearMessageQueue(messageQueue);
    });

    let withProgress = async function () {
      window.withProgress(
        {
          cancellable: true,
          location: ProgressLocation.Notification,
          title: event.body.title,
        },
        async (progress, token) => {
          token.onCancellationRequested(() => {
            languageClient.outputChannel.appendLine("User canceled the operation");
            isFinished = true;
            clearMessageQueue(messageQueue);
          });

          let item;
          progress.report({ message: "", increment: 0 }); //limpa execução anterior

          while (!isFinished) {
            await delay(200);
            while (!isFinished && messageQueue.length > 0) {
              item = messageQueue.pop();
              if (item !== undefined) {
                languageClient.outputChannel.appendLine(item.message);
                setTimeout(() => {
                  processUpdateProgress(item.message, item.percent);

                  progress.report(
                    {
                      message: item.message,
                      increment: item.increment,
                    });
                }, 100);
              }
            }
            clearMessageQueue(messageQueue);
          }

          setTimeout(() => {
            languageClient.outputChannel.appendLine(item.message);
            progress.report({ message: "Finalizado (100%)", increment: 100 });
          }, 100);

          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(true);
            }, 1000);
          });
        }
      );
    };
    withProgress();
  }
}

function clearMessageQueue(messageQueue: Array<{ message; percent; increment }>) {
  if (messageQueue !== undefined && messageQueue.length > 0) {
    messageQueue.splice(0, messageQueue.length);
  }
}

// function processShowLoadingDialogEvent(event: DebugSessionCustomEvent, debugConsole: DebugConsole) {
//   if (createTimeLineWebView !== null) {
//     createTimeLineWebView.showLoadingPageDialog(event.body.show);
//   }
// }

function processUpdateProgress(message: string, percent: number) {
  if (createTimeLineWebView !== null) {
    createTimeLineWebView.updateProgress(message, percent);
  }
}

function processShowMsgDialogEvent(event: DebugSessionCustomEvent, debugConsole: DebugConsole) {
  if (createTimeLineWebView !== null) {
    createTimeLineWebView.showMessageDialog(event.body.msgType, event.body.message);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function processShowSourcesView(event: DebugSessionCustomEvent, debugConsole: DebugConsole) {
  commands.executeCommand('tdsreplay.importSourcesOnlyResult', event.body);
}

export function procesChangeBreakpointsEvent(languageClient: LanguageClient, event: BreakpointsChangeEvent) {
  const removedList: Breakpoint[] = [];

  const verifyBp = (bp: Breakpoint) => {
    if (!bp.hasOwnProperty("functionName")) {
      const location = (bp as any).location;
      if (!fse.existsSync(location.uri.fsPath)) {
        removedList.push(bp)
      }
    }
  }

  event.added.forEach((bp: Breakpoint) => {
    verifyBp(bp);
  })

  event.changed.forEach((bp: Breakpoint) => {
    verifyBp(bp);
  })

  if (removedList.length > 0) {
    const bpList: Readonly<Breakpoint[]> = removedList;
    debug.removeBreakpoints(bpList);

    window.showWarningMessage(
      l10n.t("Removed [{0}] invalid breakpoints. See TOTVS LS console for details.", removedList.length));

    const map = groupBy(removedList, (item: any) => {
      return item.location.uri.fsPath;
    });

    let msg: string = l10n.t("Removed [{0}] invalid breakpoints.", removedList.length);

    map.forEach((item: any, key: any) => {
      msg += `\n\t${key} :`
      item.forEach((element: any, index: number) => {
        msg += `${element.location.range._start._line} ${index == item.length - 1 ? "" : ":"}`;
      });
    });

    languageClient.warn(msg);
  }
}
