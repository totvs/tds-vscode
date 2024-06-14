/*
Copyright 2021 TOTVS S.A

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
import { ReceiveMessage, TAbstractModelPanel, TFieldErrors, CommonCommandToWebViewEnum, CommonCommandFromWebViewEnum, TSendSelectResourceProps } from "tds-shared/lib";

export abstract class TdsPanel<M extends TAbstractModelPanel, O extends any = {}> {

	protected readonly _panel: vscode.WebviewPanel;
	protected _disposables: vscode.Disposable[] = [];
	protected _options: O;

	/**
	 * The  TdsPanel class protected constructor (called only from the render method).
	 *
	 * @param panel A reference to the webview panel
	 * @param extensionUri The URI of the directory containing the extension
	 */
	protected constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, options: any = {}) {
		this._panel = panel;
		this._options = options;

		// Set an event listener to listen for when the panel is disposed (i.e. when the user closes
		// the panel or when the panel is closed programmatically)
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Set the HTML content for the webview panel
		this._panel.webview.html = this.getWebviewContent(extensionUri);

		// Set an event listener to listen for messages passed from the webview context
		this._setWebviewMessageListener(this._panel.webview);
	}

	/**
	 * Cleans up and disposes of webview resources when the webview panel is closed.
	 */
	public dispose() {
		// Dispose of the current webview panel
		this._panel.dispose();

		// Dispose of all disposables (i.e. commands) for the current webview panel
		while (this._disposables.length) {
			const disposable = this._disposables.pop();

			if (disposable) {
				disposable.dispose();
			}
		}
	}

	/**
	 * Defines and returns the HTML that should be rendered within the webview panel.
	 *
	 * @remarks This is also the place where references to the React webview build files
	 * are created and inserted into the webview HTML.
	 *
	 * @param extensionUri The URI of the directory containing the extension
	 * @returns A template string literal containing the HTML that should be
	 * rendered within the webview panel
	 */
	protected abstract getWebviewContent(extensionUri: vscode.Uri): string;

	/**
	 * Sets up an event listener to listen for messages passed from the webview context and
	 * executes code based on the message that is received.
	 *
	 * @param webview A reference to the extension webview
	 */
	private _setWebviewMessageListener(webview: vscode.Webview) {
		webview.onDidReceiveMessage(
			async (message: ReceiveMessage<any, M>) => {
				const value: any = await this.defaultListener(message);
				await this.panelListener(message, value);
			},
			undefined,
			this._disposables
		);

	}

	protected abstract validateModel(model: M, errors: TFieldErrors<M>): Promise<boolean> | boolean;

	protected abstract saveModel(model: M): Promise<boolean> | boolean;

	protected sendUpdateModel(model: M, errors: TFieldErrors<M>): void {
		this._panel.webview.postMessage({
			command: CommonCommandToWebViewEnum.UpdateModel,
			data: {
				model: model,
				errors: errors
			}
		});
	}

	protected abstract panelListener<C extends CommonCommandFromWebViewEnum, T>(message: ReceiveMessage<C, M>, result: any): Promise<T>;

	private async defaultListener<T>(message: ReceiveMessage<any, M>): Promise<T> {
		let result: any = undefined;
		const command: string = message.command;
		const data = message.data;

		switch (command) {
			case CommonCommandFromWebViewEnum.Save:
			case CommonCommandFromWebViewEnum.SaveAndClose:
				let errors: TFieldErrors<M> = {};
				try {
					if (await this.validateModel(data.model, errors)) {
						if (await this.saveModel(data.model) && (command == CommonCommandFromWebViewEnum.SaveAndClose)) {
							this.dispose();
						} else {
							this.sendUpdateModel(data.model, errors);
						}
					} else {
						this.sendUpdateModel(data.model, errors);
					}
				} catch (error) {
					//errors.root = { type: "validate", message: `Internal error: ${error}` }
					this.sendUpdateModel(data.model, errors);
				}

				break;

			case CommonCommandFromWebViewEnum.Close:
				this.dispose();

				break;
			case CommonCommandFromWebViewEnum.SelectResource:
				const selectionProps: TSendSelectResourceProps = data as unknown as TSendSelectResourceProps;
				let filters = selectionProps.filters || {};

				if (!filters["All files"]) {
					filters["All files"] = ["*"];
				}

				//selectionProps.fileSystem = "serverFS";

				const options: vscode.OpenDialogOptions = {
					canSelectMany: selectionProps.canSelectMany,
					canSelectFiles: selectionProps.canSelectFiles,
					canSelectFolders: selectionProps.canSelectFolders,
					defaultUri: selectionProps.fileSystem
						? vscode.Uri.parse(`${selectionProps.fileSystem}:///${selectionProps.currentFolder}`)
						: vscode.Uri.file(selectionProps.currentFolder),
					title: selectionProps.title,
					openLabel: selectionProps.openLabel,
					filters: filters
				};

				result = await vscode.window.showOpenDialog(options).then((fileUri) => {
					message.command = CommonCommandFromWebViewEnum.AfterSelectResource;
					return fileUri
				});
				break;

			default:
				break;
		}

		return result;
	}

	/**
	 * Provides translations for the Webview.
	 * @returns An object containing the translated strings for the panel.
	 */
	protected abstract getTranslations(): Record<string, string>;

}
