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
} from "vscode";
import { TotvsConfigurationProvider } from "./TotvsConfigurationProvider";
import { TotvsConfigurationTdsReplayProvider } from "./TotvsConfigurationTdsReplayProvider";
import Utils, { groupBy, MESSAGETYPE } from "../utils";
import { CreateTDSReplayTimeLineWebView } from "./tdsreplay/TDSReplayTimeLineCreator";

import { getLanguageClient } from "../TotvsLanguageClient";
import { LanguageClient } from "vscode-languageclient";
import { TotvsConfigurationWebProvider } from "./TotvsConfigurationWebProvider";

import * as nls from "vscode-nls";
import { languageClient } from "../extension";
let localize = nls.loadMessageBundle();

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
export let createTimeLineWebView: CreateTDSReplayTimeLineWebView = null;

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

// comandos ANSI para formatação (alguns podem não funcionar)
// mais informações https://en.wikipedia.org/wiki/ANSI_escape_code

//const SANE = "\u001B[0m";
//const HIGH_INTENSITY = "\u001B[1m";
//const LOW_INTENSITY = "\u001B[2m";

//const ITALIC = "\u001B[3m";
//const UNDERLINE = "\u001B[4m";
//const BLINK = "\u001B[5m";
//const RAPID_BLINK = "\u001B[6m";
//const REVERSE_VIDEO = "\u001B[7m"; //não funcionou
//const INVISIBLE_TEXT = "\u001B[8m";

//const BLACK = "\u001B[30m";
//const RED = "\u001B[31;m";
//const GREEN = "\u001B[32m";
//const YELLOW = "\u001B[33m";
//const BLUE = "\u001B[34m";
//const MAGENTA = "\u001B[35m";
//const CYAN = "\u001B[36m";
//const WHITE = "\u001B[37m";

//const BACKGROUND_BLACK = "\u001B[40m";
//const BACKGROUND_RED = "\u001B[41m";
//const BACKGROUND_GREEN = "\u001B[42m";
//const BACKGROUND_YELLOW = "\u001B[43m";
//const BACKGROUND_BLUE = "\u001B[44m";
//const BACKGROUND_MAGENTA = "\u001B[45m";
//const BACKGROUND_CYAN = "\u001B[46m";
//const BACKGROUND_WHITE = "\u001B[47m";

/*const COLOR_TABLE = {
  'INFO': GREEN,
  'WARN': YELLOW,
  'ERROR': RED,
  'CONSOLE': BLACK,
  'TIME': CYAN
};*/

// export function procesStartDebugSessionEvent(event: any) {
//   console.log(event);
// }

export function processDebugCustomEvent(event: DebugSessionCustomEvent) {
  if (
    event.session.type.startsWith(DEBUG_TYPE) ||
    event.session.type.startsWith(WEB_DEBUG_TYPE) ||
    event.session.type.startsWith(REPLAY_DEBUG_TYPE)
  ) {
    const debugConsole = debug.activeDebugConsole;

    if (event.event === "TDA/log") {
      processLogEvent(event, debugConsole);
    } else if (event.event === "TDA/addTimeLine") {
      processAddTimeLineEvent(event, debugConsole);
    } else if (event.event === "TDA/selectTimeLine") {
      processSelectTimeLineEvent(event, debugConsole);
    } else if (event.event === "TDA/showProgress") {
      processShowProgressEvent(event, debugConsole);
    } else if (event.event === "TDA/showLoadingPageDialog") {
      processShowLoadingDialogEvent(event, debugConsole);
    }else if (event.event === "TDA/showMsgDialog") {
      processShowMsgDialogEvent(event, debugConsole);
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
      const message =
        body.message !== undefined
          ? body.message.replace("\n", "\n" + SPACES)
          : "";
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
        //console.appendLine(`${COLOR_TABLE['TIME']}[${time}]      ${COLOR_TABLE['CONSOLE']}: ${message}`);
      } else {
        debugConsole.appendLine(`[${time}] ${level}: ${message}`);
        Utils.logMessage(
          `[${time}] ${level}: ${message}`,
          MESSAGETYPE.Info,
          true
        );
        //debugConsole.appendLine(`${COLOR_TABLE['TIME']}[${time}] ${COLOR_TABLE[level]}${level}${COLOR_TABLE['CONSOLE']}: ${message}`);
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
  if (createTimeLineWebView === null) {
    let isIgnoreSourceNotFound: boolean = getIgnoreSourceNotFoundValue();
    createTimeLineWebView = new CreateTDSReplayTimeLineWebView(
      context,
      debugEvent,
      isIgnoreSourceNotFound
    );
  } else {
    if (createTimeLineWebView.isDisposed()) {
      createTimeLineWebView.reveal();
    }
    let isIgnoreSourceNotFound: boolean = getIgnoreSourceNotFoundValue();
    createTimeLineWebView.postAddTimeLineEvent(
      debugEvent,
      isIgnoreSourceNotFound
    );
  }
}

function processSelectTimeLineEvent(
  event: DebugSessionCustomEvent,
  debugConsole: DebugConsole
) {
  if (createTimeLineWebView !== null) {
    //console.log("RECEIVED SELECT TIME LINE FROM SERVER: ");
    //console.log(event.body.id)
    createTimeLineWebView.selectTimeLine(event.body.id);
  }
}

function getIgnoreSourceNotFoundValue(): boolean {
  let debugSession = debug.activeDebugSession;
  let launchConfig;
  let isIgnoreSourceNotFound: boolean = true;
  try {
    launchConfig = Utils.getLaunchConfig();

    for (let key = 0; key < launchConfig.configurations.length; key++) {
      let launchElement = launchConfig.configurations[key];
      if (
        debugSession !== undefined &&
        launchElement.name === debugSession.name
      ) {
        if (launchElement.ignoreSourcesNotFound !== undefined) {
          isIgnoreSourceNotFound = launchElement.ignoreSourcesNotFound;
          break;
        }
      }
    }
  } catch (e) {
    Utils.logInvalidLaunchJsonFile(e);
  }

  return isIgnoreSourceNotFound;
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
            languageClient.outputChannel.appendLine(
              "User canceled the operation"
            );
            isFinished = true;
          });

          let item;
          progress.report({ message: "", increment: 0 }); //limpa execução anterior

          while (!isFinished) {
            await delay(200);
            while (!isFinished && messageQueue.length > 0) {
              item = messageQueue.pop();
              languageClient.outputChannel.appendLine(item.message);
              setTimeout(() => {
                progress.report({
                  message: item.message,
                  increment: item.increment,
                });
              }, 100);
            }
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

function processShowLoadingDialogEvent(event: DebugSessionCustomEvent,debugConsole: DebugConsole) {
  if (createTimeLineWebView !== null) {
    createTimeLineWebView.showLoadingPageDialog(event.body.show);
  }
}

function processShowMsgDialogEvent(event: DebugSessionCustomEvent,debugConsole: DebugConsole) {
  if (createTimeLineWebView !== null) {
    console.log("Open Msg Dialog Received")
    createTimeLineWebView.showMessageDialog(event.body.msgType, event.body.message);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      localize(
        "tds.debug.removed.breakpoints",
        "Removed [{0}] invalid breakpoints. See TOTVS LS console for details.",
        removedList.length
      ));

    const map = groupBy(removedList, (item: any) => {
      return item.location.uri.fsPath;
    });

    let msg: string = localize(
      "tds.debug.removed.breakpoints",
      "Removed [{0}] invalid breakpoints.",
      removedList.length
    );

    map.forEach((item: any, key: any) => {
      msg += `\n\t${key} :`
      item.forEach((element: any, index: number) => {
        msg += `${element.location.range._start._line} ${index == item.length - 1 ? "" : ":"}`;
      });
    });

    languageClient.warn(msg);
  }
}
