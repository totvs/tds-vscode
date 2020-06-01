//import * as vscode from "vscode";
import { debug, DebugConsole, DebugSessionCustomEvent, ExtensionContext, ProgressLocation, window } from "vscode";
import {TotvsConfigurationProvider} from "./TotvsConfigurationProvider";
import {TotvsConfigurationTdsReplayProvider} from "./TotvsConfigurationTdsReplayProvider";
import Utils, { MESSAGETYPE } from "../utils";
import { CreateTDSReplayTimeLineWebView } from './tdsreplay/CreateTDSReplayTimeLineWebView';

import { getLanguageClient } from '../TotvsLanguageClient';
import { LanguageClient } from 'vscode-languageclient';

import {ProgressOptions} from "vscode"

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
export let createTimeLineWebView: CreateTDSReplayTimeLineWebView = null;
let languageClient: LanguageClient;

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

export function processDebugCustomEvent(event: DebugSessionCustomEvent) {
	if (event.session.type.startsWith(DEBUG_TYPE) || event.session.type.startsWith(WEB_DEBUG_TYPE) || event.session.type.startsWith(REPLAY_DEBUG_TYPE)) {
		const debugConsole = debug.activeDebugConsole;

		if(languageClient === undefined) {
			languageClient = getLanguageClient(context);
			if (event.session.type.startsWith(REPLAY_DEBUG_TYPE)) {
				languageClient.clientOptions.outputChannelName = "TDS Replay";
			} else if(event.session.type.startsWith(DEBUG_TYPE)) {
				languageClient.clientOptions.outputChannelName = "Totvs Debug Messages";
			}
		}

		if (event.event === 'TDA/log') {
			processLogEvent(event, debugConsole);
		} else if(event.event === 'TDA/addTimeLine')  {
			processAddTimeLineEvent(event, debugConsole);
		} else if(event.event === 'TDA/selectTimeLine')  {
			processSelectTimeLineEvent(event, debugConsole);
		} else if (event.event === 'TDA/showProgress') {
			processShowProgressEvent(event, debugConsole);
		}
	}
}

function processLogEvent(event: DebugSessionCustomEvent, debugConsole: DebugConsole) {
	if (event.event === 'TDA/log') {
		if (instanceOfLogBody(event.body)) {
			const body = event.body;
			const notify = body.notify;
			const level = body.level;
			const message = body.message.replace("\n", "\n" + SPACES);
			const time = body.time;

			if (notify) {
				if (level === eLogLevelEvent.ellError) {
					window.showErrorMessage(message);
				}
				else if (level === eLogLevelEvent.ellInformation) {
					window.showInformationMessage(message);
				}
				else if(level === eLogLevelEvent.ellWarning) {
					window.showWarningMessage(message);
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

function processAddTimeLineEvent(debugEvent: DebugSessionCustomEvent, console: DebugConsole) {
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

function processSelectTimeLineEvent(event: DebugSessionCustomEvent, debugConsole: DebugConsole) {
	if(createTimeLineWebView !== null) {
		//console.log("RECEIVED SELECT TIME LINE FROM SERVER: ");
		//console.log(event.body.id)
		createTimeLineWebView.selectTimeLine(event.body.id);
	 }
}

function getIgnoreSourceNotFoundValue(): boolean {
	let debugSession = debug.activeDebugSession;
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

let showProgressInfoEachPercent: number = 2;
let progressStarted: boolean = false;
let isFinished: boolean = false;
let messageQueue: Array<{message, percent}> = new Array<{message, percent}>();

function processShowProgressEvent(event: DebugSessionCustomEvent, debugConsole: DebugConsole) {

	if(event.session) {
		if(event.session.configuration.showProgressInfoEachPercent && event.session.configuration.showProgressInfoEachPercent != showProgressInfoEachPercent) {
			showProgressInfoEachPercent = event.session.configuration.showProgressInfoEachPercent;
		}
	}

	const message: string = `${event.body.detailMessage} ( ${event.body.currentWork}% )`;
	messageQueue.push({message: message, percent: event.body.currentWork});

	if(event.body.currentWork == 100) {
		isFinished = true;
	}
	if(!progressStarted) {
		progressStarted = true;
		languageClient.outputChannel.appendLine("Iniciando withProgress");

		let withProgress = async function() {
			window.withProgress(
				{
					cancellable: false,
					location: ProgressLocation.Notification,
					title: "Importing TDS Replay",
				},
				async (progress, token) =>
				{
					token.onCancellationRequested(() => {
						languageClient.outputChannel.appendLine("User canceled the operation");
						isFinished = true;
					});

					let item;

					while(!isFinished) {
						await delay(200);
					 	while( !isFinished && messageQueue.length > 0) {
							item = messageQueue.pop();
					 		setTimeout(() => {
								progress.report({message: item.message, increment: showProgressInfoEachPercent});
							}, 3000);
							languageClient.outputChannel.appendLine(item.message);
						}
					}

					setTimeout(() => {
						progress.report({ message: "Finalizado (100%)", increment: 100 });
					}, 1000);

					return new Promise((resolve) => {
						setTimeout(() => {
							resolve();
						}, 1000);
					});
				}
			);
		}
		withProgress();
	}
}

function delay(ms: number)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

