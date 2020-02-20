import * as vscode from "vscode";
import {TotvsConfigurationProvider} from "./TotvsConfigurationProvider";
import {TotvsConfigurationTdsReplayProvider} from "./TotvsConfigurationTdsReplayProvider";
import Utils, { MESSAGETYPE } from "../utils";
import ShowProgressController from "../ui.dialogs/showProgressController"
import { CreateTDSReplayTimeLineWebView } from './tdsreplay/CreateTDSReplayTimeLineWebView';

const DEBUG_TYPE = TotvsConfigurationProvider.type;
const WEB_DEBUG_TYPE: string = "totvs_language_web_debug";
const REPLAY_DEBUG_TYPE = TotvsConfigurationTdsReplayProvider.type;

interface LogBody {
	time: string;
	level: string;
	notify: boolean;
	message: string;
}

let context;
let showProgressController = new ShowProgressController();
export let createTimeLineWebView: CreateTDSReplayTimeLineWebView = null;

export class DebugEvent {
	constructor(pContext: vscode.ExtensionContext) {
		context = pContext;
		//vscode.debug.onDidTerminateDebugSession(event => {
		//});
	}
	processShowProgressEvent(title:string, mainMessage: string, detailMessage: string, currentWork, totalWork) {
		showProgressController.showProgress(context, title, mainMessage, detailMessage, currentWork, totalWork);
	}
}


function instanceOfLogBody(object: any): object is LogBody {
	return "level" in object;
}

enum eLogLevelEvent { ellInformation = 'INFO', ellWarning = 'WARN', ellError = 'ERROR', ellConsole = 'CONSOLE' }
const SPACES: string = ' '.repeat(11);

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

export function processDebugCustomEvent(event: vscode.DebugSessionCustomEvent) {
	if (event.session.type.startsWith(DEBUG_TYPE) || event.session.type.startsWith(WEB_DEBUG_TYPE) || event.session.type.startsWith(REPLAY_DEBUG_TYPE)) {
		const debugConsole = vscode.debug.activeDebugConsole;

		if (event.event === 'TDA/log') {
			processLogEvent(event, debugConsole);
		} else if(event.event === 'TDA/addTimeLine')  {
			processAddTimeLineEvent(event, debugConsole);
		} else if(event.event === 'TDA/selectTimeLine')  {
			processSelectTimeLineEvent(event, debugConsole);
		} else if (event.event === 'TDA/showProgress') {
			processShowProgressEvent(event);
		}
	}
}

function processLogEvent(event: vscode.DebugSessionCustomEvent, debugConsole: vscode.DebugConsole) {
	if (event.event === 'TDA/log') {
		if (instanceOfLogBody(event.body)) {
			const body = event.body;
			const notify = body.notify;
			const level = body.level;
			const message = body.message.replace("\n", "\n" + SPACES);
			const time = body.time;

			if (notify) {
				if (level === eLogLevelEvent.ellError) {
					vscode.window.showErrorMessage(message);
				}
				else if (level === eLogLevelEvent.ellInformation) {
					vscode.window.showInformationMessage(message);
				}
				else if (level === eLogLevelEvent.ellWarning) {
					vscode.window.showWarningMessage(message);
				}
			}

			if (level === eLogLevelEvent.ellConsole) {
				debugConsole.appendLine(`[${time}]      : ${message}`);
				//console.appendLine(`${COLOR_TABLE['TIME']}[${time}]      ${COLOR_TABLE['CONSOLE']}: ${message}`);
			} else {
				debugConsole.appendLine(`[${time}] ${level}: ${message}`);
				Utils.logMessage(`[${time}] ${level}: ${message}`, MESSAGETYPE.Info, true);
				//debugConsole.appendLine(`${COLOR_TABLE['TIME']}[${time}] ${COLOR_TABLE[level]}${level}${COLOR_TABLE['CONSOLE']}: ${message}`);
			}
		} else {
			debugConsole.appendLine("<evento desconhecido>");
			debugConsole.appendLine(JSON.stringify(event.event));
		}
	}
}

function processAddTimeLineEvent(debugEvent: vscode.DebugSessionCustomEvent, console: vscode.DebugConsole) {
	if(createTimeLineWebView === null) {
		let isIgnoreSourceNotFound: boolean = getIgnoreSourceNotFoundValue();
		createTimeLineWebView = new CreateTDSReplayTimeLineWebView(context, debugEvent, isIgnoreSourceNotFound);
	} else {
		if(createTimeLineWebView.isDisposed()) {
			createTimeLineWebView.reveal();
		}
		let isIgnoreSourceNotFound: boolean = getIgnoreSourceNotFoundValue();
		createTimeLineWebView.postAddTimeLineEvent(debugEvent, isIgnoreSourceNotFound);
	}
}

function processSelectTimeLineEvent(event: vscode.DebugSessionCustomEvent, debugConsole: vscode.DebugConsole) {
	if(createTimeLineWebView !== null) {
		//console.log("RECEIVED SELECT TIME LINE FROM SERVER: ");
		//console.log(event.body.id)
		createTimeLineWebView.selectTimeLine(event.body.id);
	 }
}

function getIgnoreSourceNotFoundValue(): boolean {
	let debugSession = vscode.debug.activeDebugSession;
	let launchConfig = Utils.getLaunchConfig();
	let isIgnoreSourceNotFound: boolean = true;

	for (var key = 0; key < launchConfig.configurations.length; key++) {
		var launchElement = launchConfig.configurations[key];
		if(debugSession !== undefined && launchElement.name === debugSession.name) {
			if(launchElement.ignoreSourcesNotFound !== undefined) {
				isIgnoreSourceNotFound = launchElement.ignoreSourcesNotFound;
				break;
			}
		}
	}

	// launchConfig.configurations.forEach(launchElement => {
	// 	if(debugSession !== undefined && launchElement.name === debugSession.name) {
	// 		if(launchElement.ignoreSourcesNotFound !== undefined) {
	// 			isIgnoreSourceNotFound = launchElement.ignoreSourcesNotFound;
	// 		}
	// 	}
	// });

	return isIgnoreSourceNotFound;
}

function processShowProgressEvent(event: vscode.DebugSessionCustomEvent) {
	showProgressController.showProgress(context, event.body.title, event.body.mainMessage, event.body.detailMessage, event.body.currentWork, event.body.totalWork);
}