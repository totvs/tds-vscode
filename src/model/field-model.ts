import * as vscode from "vscode";
import { CommonCommandFromWebViewEnum, CommonCommandToWebViewEnum, ReceiveMessage } from "../panels/utilities/common-command-panel";
import Utils, { MESSAGE_TYPE } from "../utils";

export type TErrorType =
	"required"
	| "min"
	| "max"
	| "minLength"
	| "maxLength"
	| "pattern"
	| "validate"
	| "warning";

export type TFieldError = {
	type: TErrorType;
	message?: string
};

export type TFieldErrors<M> = Partial<Record<keyof M | "root", TFieldError>>;

export function isErrors<M>(errors: TFieldErrors<M>) {
	return Object.keys(errors).length > 0
};

export type TIncludePath = {
	path: string;
}

export type TModelPanel = {

}

export type TSendSelectResourceProps = TModelPanel & {
	firedBy: string;
	canSelectMany: boolean,
	canSelectFiles: boolean,
	canSelectFolders: boolean,
	currentFolder: string,
	title: string,
	openLabel: string,
	filters: {
		[key: string]: string[]
	}
}

export abstract class TdsPanel<M extends TModelPanel> {

	protected readonly _panel: vscode.WebviewPanel;
	protected _disposables: vscode.Disposable[] = [];

	/**
	 * The  TdsPanel class protected constructor (called only from the render method).
	 *
	 * @param panel A reference to the webview panel
	 * @param extensionUri The URI of the directory containing the extension
	 */
	protected constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;

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
	protected abstract getWebviewContent(extensionUri: vscode.Uri);

	/**
	 * Sets up an event listener to listen for messages passed from the webview context and
	 * executes code based on the message that is received.
	 *
	 * @param webview A reference to the extension webview
	 */
	private _setWebviewMessageListener(webview: vscode.Webview) {
		webview.onDidReceiveMessage(
			async (message: ReceiveMessage<CommonCommandFromWebViewEnum, M>) => {
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

	private async defaultListener<T>(message: ReceiveMessage<CommonCommandFromWebViewEnum, M>): Promise<T> {
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
					errors.root = { type: "validate", message: `Internal error: ${error}` }
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

				const options: vscode.OpenDialogOptions = {
					canSelectMany: selectionProps.canSelectMany,
					canSelectFiles: selectionProps.canSelectFiles,
					canSelectFolders: selectionProps.canSelectFolders,
					defaultUri: vscode.Uri.file(selectionProps.currentFolder),
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

	logWarning(message: string) {
		Utils.logMessage(message, MESSAGE_TYPE.Warning, false);
	}

	logInfo(message: string) {
		Utils.logMessage(message, MESSAGE_TYPE.Info, false);
	}

	logError(message: string) {
		Utils.logMessage(message, MESSAGE_TYPE.Error, false);
	}
}
