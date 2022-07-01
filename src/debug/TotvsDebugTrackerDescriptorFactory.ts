import { text } from 'stream/consumers';
import { DebugSession, ProviderResult, ExtensionContext, DebugAdapterTrackerFactory, DebugAdapterTracker, debug, workspace } from 'vscode';
import Utils from '../utils';

let context;

export class TotvsDebugTrackerDescriptorFactory implements DebugAdapterTrackerFactory {

	constructor(pContext: ExtensionContext,
	) {
		context = pContext;
	}

	createDebugAdapterTracker(session: DebugSession): ProviderResult<DebugAdapterTracker> {

		const printMessage = (label: string, message: any, force: boolean = false) => {
			const config = workspace.getConfiguration("totvsLanguageServer");
			const trace: string = config.trace.debug;
			const now: Date = new Date();
			let text: string = `[Trace - ${Utils.timeAsHHMMSS(now)}] ${label}`;

			if (trace == "verbose") {
				text = `${text}\n${JSON.stringify(message, undefined, "  ")}`
			} else if (message.hasOwnProperty("command")) {
				text = `${text} type: ${message.type} command: ${message.command}`;
			} else if (message.hasOwnProperty("type") && message.type == "event") {
				text = `${text} type: ${message.type} event: ${message.event} ${message.body?.description || message.body?.message || ""}`;
			} else {
				text = `${text}\n${JSON.stringify(message, undefined, "  ")}`
			}

			console.log(text);

			if ((trace !== "off") || force) {
				debug.activeDebugConsole?.appendLine(text);
			}
		};

		const tracker: DebugAdapterTracker = {
			onDidSendMessage: (message: any) => {
				printMessage("<<", message);
			},
			onWillReceiveMessage: (message: any) => {
				printMessage(">>", message);
			},
			onWillStartSession: () => {
				printMessage("##", { type: "event", command: "onWillStartSession" });
			},
			onWillStopSession: () => {
				printMessage("##", { type: "event", command: "onWillStopSession" });
			},
			onError: (error: Error) => {
				printMessage(" ", error, true);
			},
			onExit: (code: number | undefined, signal: string | undefined) => {
				printMessage("##", { type: "event", command: `exit code=${code || ""} signal=${signal || ""}` });
			},
		};

		return tracker;
	}
}