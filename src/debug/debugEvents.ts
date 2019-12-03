import * as vscode from "vscode";

const DEBUG_TYPE: string = "totvs_language_debug";
const WEB_DEBUG_TYPE: string = "totvs_language_web_debug";

interface LogBody {
	time: string;
	level: string;
	notify: boolean;
	message: string;
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
	if (event.session.type.startsWith(DEBUG_TYPE) || event.session.type.startsWith(WEB_DEBUG_TYPE)) {
		const console = vscode.debug.activeDebugConsole;

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
					console.appendLine(`[${time}]      : ${message}`);
					//console.appendLine(`${COLOR_TABLE['TIME']}[${time}]      ${COLOR_TABLE['CONSOLE']}: ${message}`);
				} else {
					console.appendLine(`[${time}] ${level}: ${message}`);
					//console.appendLine(`${COLOR_TABLE['TIME']}[${time}] ${COLOR_TABLE[level]}${level}${COLOR_TABLE['CONSOLE']}: ${message}`);
				}
			} else {
				console.appendLine("<evento desconhecido>");
				console.appendLine(JSON.stringify(event.event));
			}
		}
	}
}
