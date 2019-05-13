import path = require('path');
import fs = require('fs');
import { extensions, window, Uri, ViewColumn } from 'vscode';
import { deletePrograms } from '../tdsBuild';
import * as nls from 'vscode-nls';

let localize = nls.config({ locale: 'en' })();
const compile = require('template-literal');

const localizeHTML = {
	"tds.webview.deleteFile.title": localize("tds.webview.deleteFile.title","Deleting source/resource from RPO"),
	"tds.webview.deleteFile.line1": localize("tds.webview.deleteFile.line1","In order to delete a source/resource from RPO follow these steps:"),
	"tds.webview.deleteFile.line2": localize("tds.webview.deleteFile.line2","Find source/resource in workspace"),
	"tds.webview.deleteFile.line3": localize("tds.webview.deleteFile.line3","Select source/recourse with rigth mouse buttom"),
	"tds.webview.deleteFile.line4": localize("tds.webview.deleteFile.line4","Select the option 'Delete source/resource from RPO' on popup menu"),
	"tds.webview.deleteFile.line5": localize("tds.webview.deleteFile.line5","Confirm file deletion selecting the option 'YES' in the form displayed on the bottom right corner.")
}

export function deleteFileFromRPO(context: any): void {

	let filename: string = "";
	if(context.contextValue === "serverItem") {
		const currentPanel = window.createWebviewPanel(
			'totvs-developer-studio.delete.file.fromRPO',
			'Delete File From RPO',
			ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);
		let ext = extensions.getExtension("TOTVS.totvs-developer-studio");
		if(ext) {
			currentPanel.webview.html = getWebViewContent(ext,localizeHTML);
		}
	} else {
		if(context.fsPath && context.fsPath !== undefined) { //A ação veio pelo menu de contexto por exemplo, e/ou com o fsPath preenchido corretamente
			filename = context.fsPath;
		}
		if(filename !== "") {
			window.showWarningMessage(localize('tds.vscode.delete_prw_file',"Are you sure you want to delete {0} from RPO?",path.basename(filename)), localize('tds.vscode.yes','Yes'), localize('tds.vscode.no','No')).then(clicked => {
				if (clicked === localize('tds.vscode.yes','Yes')) {
					deletePrograms([path.basename(filename)]);
				}
			});
		}
	}

	function getWebViewContent(context, localizeHTML){

		const htmlOnDiskPath = Uri.file(path.join(context.extensionPath, 'src', 'server', 'deleteFileFromRPO.html'));
		const cssOniskPath = Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

		const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
		const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

		let runTemplate = compile(htmlContent);

		return runTemplate({css: cssContent,localize: localizeHTML});
	}

}