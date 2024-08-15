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
import { languageClient } from "./extension";
import { log } from "console";

export namespace Logger {

	export enum MESSAGE_TYPE {
		/**
		 * Type for informative and resumed messages
		 * i.e.: Inform only the beginning and the end of a compilation process.
		 */
		Info = "Info",

		/**
		 * Type for error messages
		 */
		Error = "Error",

		/**
		 * Type for warning messages
		 */
		Warning = "Warning",

		/**
		 * Type for detailed messages
		 * i.e.: During a compilation process, inform the status of each file and it's result.
		 */
		Log = "Log",
	}

	/**
	  * Logs a warning message in the console and optionally shows a dialog.
	  * @param message - The warning message to be logged.
	  * @param showDialog - Indicates whether to show a dialog for the warning message.
	  */
	export function logWarning(message: string, showDialog: boolean = true) {
		logMessage(message, MESSAGE_TYPE.Warning, showDialog);
	}

	export function logInfo(message: string, showDialog: boolean = true) {
		logMessage(message, MESSAGE_TYPE.Info, showDialog);
	}

	export function logError(error: string | Error, showDialog: boolean = true) {
		if (error instanceof Error) {
			logMessage(error.message, MESSAGE_TYPE.Error, showDialog);

			const typeError: any = error as any;
			if (typeError.cause && typeError.cause.message) {
				logMessage(typeError.cause.message, MESSAGE_TYPE.Error, false);
			}
			if (typeError.cause && typeError.cause.errors) {
				logMessage(typeError.cause.errors, MESSAGE_TYPE.Error, false);
			}
		} else {
			logMessage(error, MESSAGE_TYPE.Error, showDialog);
		}
	}

	/**
	   * Logs the informed messaged in the console and/or shows a dialog
	   * Please note that the dialog opening respects the dialog settings defined by the user in editor.show.notification
	   * @param message - The message to be shown
	   * @param messageType - The message type
	   * @param showDialog - If it must show a dialog.
	   */
	function logMessage(
		message: string,
		messageType: MESSAGE_TYPE,
		showDialog: boolean
	) {
		const config = vscode.workspace.getConfiguration("totvsLanguageServer");
		const notificationLevel = config.get("editor.show.notification");

		switch (messageType) {
			case MESSAGE_TYPE.Error:
				console.log(message);
				languageClient?.error(message, undefined, showDialog);
				if (showDialog && notificationLevel !== "none") {
					vscode.window.showErrorMessage(message);
				}
				break;
			case MESSAGE_TYPE.Info:
				console.log(message);
				languageClient?.info(message);
				if (
					(showDialog && notificationLevel === "all") ||
					notificationLevel === "errors warnings and infos"
				) {
					vscode.window.showInformationMessage(message);
				}
				break;
			case MESSAGE_TYPE.Warning:
				console.log(message);
				languageClient?.warn(message);
				if (
					showDialog &&
					(notificationLevel === "all" ||
						notificationLevel === "errors warnings and infos" ||
						notificationLevel === "errors and warnings")
				) {
					vscode.window.showWarningMessage(message);
				}
				break;
			case MESSAGE_TYPE.Log:
				const time = timeAsHHMMSS(new Date());
				console.log(message);
				languageClient?.outputChannel.appendLine(
					"[Log   + " + time + "] " + message
				);
				if (showDialog && notificationLevel === "all") {
					vscode.window.showInformationMessage(message);
				}
				break;
		}
	}

	/**
	 * Formats a `Date` object as a string in the format "HH:MM:SS".
	 *
	 * @param date - The `Date` object to format.
	 * @returns A string representation of the date in the format "HH:MM:SS".
	 */
	export function timeAsHHMMSS(date: Date): string {
		return (
			leftPad(date.getHours(), 2) +
			":" +
			leftPad(date.getMinutes(), 2) +
			":" +
			leftPad(date.getSeconds(), 2)
		);
	}

	export function leftPad(value: number | string, resultLength = 2, leftPadChar: string = "0"): string {
		return (leftPadChar.repeat(resultLength) + String(value).slice(String(value).length));
	}
}