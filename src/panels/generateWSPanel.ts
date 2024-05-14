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
import Utils, { MESSAGE_TYPE, ServersConfig, serverExceptionCodeToString } from "../utils";
import { CommonCommandFromWebViewEnum, ReceiveMessage } from "./utilities/common-command-panel";
import { IWsdlGenerateResult, sendWsdlGenerateRequest } from "../protocolMessages";
import { TWebServiceModel } from "../model/webServiceModel";
import * as fse from "fs-extra";
import path from "path";
import { _debugEvent } from "../debug";
import { TFieldErrors, TSendSelectResourceProps, TdsPanel, isErrors } from "./panel";

enum GenerateWebServiceCommandEnum {
}

type GenerateWebServiceCommand = CommonCommandFromWebViewEnum & GenerateWebServiceCommandEnum;

export class GenerateWebServicePanel extends TdsPanel<TWebServiceModel> {
	public static currentPanel: GenerateWebServicePanel | undefined;

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

		super.dispose();
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
	protected getWebviewContent(extensionUri: vscode.Uri) {

		return getWebviewContent(this._panel.webview, extensionUri, "generateWebServiceView",
			{ title: this._panel.title, translations: this.getTranslations() });
	}

	/**
	 * Sets up an event listener to listen for messages passed from the webview context and
	 * executes code based on the message that is received.
	 *
	 * @param webview A reference to the extension webview
	 */
	protected async panelListener(message: ReceiveMessage<GenerateWebServiceCommand, TWebServiceModel>, result: any): Promise<any> {
		const command: GenerateWebServiceCommand = message.command;
		const data = message.data;

		switch (command) {
			case CommonCommandFromWebViewEnum.Ready:
				data.model = {
					urlOrWsdlFile: "",
					outputPath: "",
					outputFilename: "",
					overwrite: false
				};

				this.sendUpdateModel(data.model, undefined);
				break;
			case CommonCommandFromWebViewEnum.AfterSelectResource:
				if (result && result.length > 0) {
					const selectionProps: TSendSelectResourceProps = data as unknown as TSendSelectResourceProps;
					const selectedFile: string = (result[0] as vscode.Uri).fsPath;

					if (selectionProps.firedBy == "btn-urlOrWsdlFile") {
						data.model.urlOrWsdlFile = selectedFile;
					} else if (selectionProps.firedBy == "btn-outputPath") {
						data.model.outputPath = selectedFile;
					} else if (selectionProps.firedBy == "btn-outputFilename") {
						const folder: string = path.dirname(selectedFile);
						const file: string = path.basename(selectedFile);

						data.model.outputPath = folder;
						data.model.outputFilename = file;
						data.model.overwrite = true;
					}

					this.sendUpdateModel(data.model, undefined);
				}

				break;
		}
	}

	protected async validateModel(model: TWebServiceModel, errors: TFieldErrors<TWebServiceModel>): Promise<boolean> {
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

		return !isErrors(errors);
	}

	protected async saveModel(model: TWebServiceModel): Promise<boolean> {
		let server = ServersConfig.getCurrentServer();
		const response: IWsdlGenerateResult = await sendWsdlGenerateRequest(server, model.urlOrWsdlFile);

		if (response.returnCode !== 0) {
			let errors: TFieldErrors<TWebServiceModel> = {};
			let error: string = `Protheus server was unable to generate the WS client. Code: ${response.returnCode}`;

			errors.root = { type: "validate", message: error };
			this.sendUpdateModel(model, errors)

			error += ` [${serverExceptionCodeToString(response.returnCode)}]`;
			Utils.logMessage(error, MESSAGE_TYPE.Error, true);

			return false;
		}

		const pathFile = path.join(model.outputPath, model.outputFilename);

		if (fse.existsSync(pathFile) && (model.overwrite)) {
			fse.removeSync(pathFile);
		}

		this.createAndWriteOpen(pathFile, response.content);

		return true;
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

	protected getTranslations(): Record<string, string> {
		return {
			"URL or Wsdl File": vscode.l10n.t("URL or Wsdl File"),
			"Enter the WSDL access URL or the file with the service definition": vscode.l10n.t("Enter the WSDL access URL or the file with the service definition"),
			"Select the file with the service definition": vscode.l10n.t("Select the file with the service definition"),
			"File with WSDL definition": vscode.l10n.t("File with WSDL definition"),
			"Output directory": vscode.l10n.t("Output directory"),
			"Select the folder from where the generated source will be recorded": vscode.l10n.t("Select the folder from where the generated source will be recorded"),
			"Select Output Directory": vscode.l10n.t("Select Output Directory"),
			"Output Filename": vscode.l10n.t("Output Filename"),
			"Source Name to be recorded": vscode.l10n.t("Source Name to be recorded"),
			"Select the file that will receive the definition of the service": vscode.l10n.t("Select the file that will receive the definition of the service"),
			"ADVPL Source File": vscode.l10n.t("ADVPL Source File"),
			"If already exist, can overwrite": vscode.l10n.t("If already exist, can overwrite")
		}
	}
}