import { DebugSession, ProviderResult, ExtensionContext, DebugAdapterTrackerFactory, DebugAdapterTracker, debug, workspace } from 'vscode';
import Utils from '../utils';
import { Logger } from '../logger';

export class TotvsDebugTrackerDescriptorFactory implements DebugAdapterTrackerFactory {

	createDebugAdapterTracker(session: DebugSession): ProviderResult<DebugAdapterTracker> {

		const printMessage = (label: string, message: any) => {
			const config = workspace.getConfiguration("totvsLanguageServer");
			const trace: string = config.trace.debug;

			if (trace == "off") {
				return;
			}

			const now: Date = new Date();
			let text: string = `[${Logger.timeAsHHMMSS(now)}] TRACE: ${label}`;

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
			debug.activeDebugConsole?.appendLine(text);
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
				printMessage(" ", error);
			},
			onExit: (code: number | undefined, signal: string | undefined) => {
				printMessage("##", { type: "event", command: `exit code=${code || ""} signal=${signal || ""}` });
			},
		};

		return tracker;
	}
}