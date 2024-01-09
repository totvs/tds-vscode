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
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";
import Utils, { ServersConfig } from "../utils";
import { CommonCommandFromWebViewEnum, CommonCommandToWebViewEnum, ReceiveMessage } from "./utilities/common-command-panel";
import { IValidationInfo, IWsdlGenerateResult, sendValidationRequest, sendWsdlGenerateRequest } from "../protocolMessages";
import { ITdsPanel, TFieldErrors, TIncludePath, isErrors } from "../model/field-model";
import { TWebServiceModel } from "../model/webServiceModel";
import * as fse from "fs-extra";
import path from "path";
import { _debugEvent } from "../debug";

enum GenerateWebServiceCommandEnum {
}

type GenerateWebServiceCommand = CommonCommandFromWebViewEnum & GenerateWebServiceCommandEnum;

export class GenerateWebServicePanel implements ITdsPanel<TWebServiceModel> {
	public static currentPanel: GenerateWebServicePanel | undefined;
	private readonly _panel: vscode.WebviewPanel;
	private _disposables: vscode.Disposable[] = [];

	/**
	 * The GenerateWebServicePanel class private constructor (called only from the render method).
	 *
	 * @param panel A reference to the webview panel
	 * @param extensionUri The URI of the directory containing the extension
	 */
	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;

		// Set an event listener to listen for when the panel is disposed (i.e. when the user closes
		// the panel or when the panel is closed programmatically)
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Set the HTML content for the webview panel
		this._panel.webview.html = this._getWebviewContent(extensionUri);

		// Set an event listener to listen for messages passed from the webview context
		this._setWebviewMessageListener(this._panel.webview);
	}

	public static render(context: vscode.ExtensionContext): GenerateWebServicePanel {
		const extensionUri: vscode.Uri = context.extensionUri;

		if (GenerateWebServicePanel.currentPanel) {
			// If the webview panel already exists reveal it
			GenerateWebServicePanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
		} else {
			// If a webview panel does not already exist create and show a new one
			const panel = vscode.window.createWebviewPanel(
				// Panel view type
				"generate-wev-service--panel",
				// Panel title
				vscode.l10n.t("Generate Web Service Client"),
				// The editor column the panel should be displayed in
				vscode.ViewColumn.One,
				// Extra panel configurations
				{
					...getExtraPanelConfigurations(extensionUri)
				}
			);

			GenerateWebServicePanel.currentPanel = new GenerateWebServicePanel(panel, extensionUri);
		}

		return GenerateWebServicePanel.currentPanel;
	}

	/**
	 * Cleans up and disposes of webview resources when the webview panel is closed.
	 */
	public dispose() {
		GenerateWebServicePanel.currentPanel = undefined;

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
	private _getWebviewContent(extensionUri: vscode.Uri) {

		return getWebviewContent(this._panel.webview, extensionUri, "generateWebServiceView", { title: this._panel.title });
	}

	/**
	 * Sets up an event listener to listen for messages passed from the webview context and
	 * executes code based on the message that is received.
	 *
	 * @param webview A reference to the extension webview
	 */
	private _setWebviewMessageListener(webview: vscode.Webview) {
		webview.onDidReceiveMessage(
			async (message: ReceiveMessage<GenerateWebServiceCommand, TWebServiceModel>) => {
				const command: GenerateWebServiceCommand = message.command;
				const data = message.data;

				switch (command) {
					case CommonCommandFromWebViewEnum.Ready:
						if (data.model == undefined) {
							this._sendUpdateModel({
								urlOrWsdlFile: "",
								outputPath: "",
								outputFilename: "",
								overwrite: false
							});
						}
						break;
					case CommonCommandFromWebViewEnum.Close:
						GenerateWebServicePanel.currentPanel.dispose();
						break;
					case CommonCommandFromWebViewEnum.Save:
					case CommonCommandFromWebViewEnum.SaveAndClose:
						let errors: TFieldErrors<TWebServiceModel> = {};

						if (await this._validateModel(data.model, errors)) {
							if (this._saveModel(data.model)) {
								if (command === CommonCommandFromWebViewEnum.SaveAndClose) {
									GenerateWebServicePanel.currentPanel.dispose();
								} else {
									this._sendUpdateModel({
										urlOrWsdlFile: "",
										outputPath: data.model.outputFilename,
										outputFilename: "",
										overwrite: false
									});
								}
							}
						} else {
							this._sendValidateResponse(errors);
						}

						break;
				}
			},
			undefined,
			this._disposables
		);
	}

	async _validateModel(model: TWebServiceModel, errors: TFieldErrors<TWebServiceModel>): Promise<boolean> {
		try {
			model.urlOrWsdlFile = model.urlOrWsdlFile.trim();
			model.outputPath = model.outputPath.trim();
			model.outputFilename = model.outputFilename.trim();

			if ((model.urlOrWsdlFile.length == 0)) {
				errors.urlOrWsdlFile = { type: "required" };
			}

			if (model.outputPath.length == 0) {
				errors.outputPath = { type: "required" };
			} else if (!fse.existsSync(model.outputPath)) {
				errors.outputPath = { type: "validate", message: "[Output folder] not exist or invalid" };
			}

			const extension: string = path.extname(model.outputFilename).toLowerCase();
			if (model.outputFilename.length == 0) {
				errors.outputFilename = { type: "required" };
			} else if (extension !== ".prw" && extension !== ".prx" && extension !== ".tlpp") {
				errors.outputFilename = { type: "validate", message: "[Output file] must have one of the following extensions: .prw, .prx or .tlpp" };
			} else if (fse.existsSync(path.join(model.outputPath, model.outputFilename))) {
				if (!model.overwrite) {
					errors.outputFilename = { type: "validate", message: "[Output file] already exist" };
				}
			}
		} catch (error) {
			errors.root = { type: "validate", message: `Internal error: ${error}` }
		}

		return !isErrors(errors);
	}

	async _saveModel(model: TWebServiceModel): Promise<boolean> {
		if (_debugEvent) {
			vscode.window.showWarningMessage("This operation is not allowed during a debug.")
			return;
		}
		let server = ServersConfig.getCurrentServer();
		const response: IWsdlGenerateResult = await sendWsdlGenerateRequest(server, model.urlOrWsdlFile);
		if (response.returnCode !== 0) {
			let errors: TFieldErrors<TWebServiceModel> = {};
			errors.root = { type: "validate", message: `Protheus server was unable to generate the WS client. Code: ${response.returnCode}` };
			this._sendValidateResponse(errors)

			return false;
		}

		const pathFile = path.join(model.outputPath, model.outputFilename);

		if (fse.existsSync(pathFile) && (model.overwrite)) {
			fse.removeSync(pathFile);
		}

		this.createAndWriteOpen(pathFile, response.content);

		return true;
	}

	_sendValidateResponse(errors: TFieldErrors<TWebServiceModel>) {
		this._panel.webview.postMessage({
			command: CommonCommandToWebViewEnum.ValidateResponse,
			data: errors,
		});
	}

	_sendUpdateModel(model: TWebServiceModel): void {
		this._panel.webview.postMessage({
			command: CommonCommandToWebViewEnum.UpdateModel,
			data: {
				model: model
			}
		});
	}

	private createAndWriteOpen(filePath: string, content: string) {
		try {
			fse.writeFileSync(filePath, content);

			vscode.window.showInformationMessage("The file was successfully created. Would like open? ", { modal: true }, 'Yes', 'No').then(clicked => {
				if (clicked === 'Yes') {
					vscode.window.showTextDocument(vscode.Uri.file(filePath));
				}
			});
		} catch (error) {
			vscode.window.showErrorMessage(error);
		}
	}

}