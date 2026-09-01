import * as vscode from "vscode";
import { languageClient, applyFormattingMode } from "./extension";
import { sendDidChangeConfiguration, sendDidSaveTextDocument } from "./protocolMessages";
import { warningNeedRestart, getModifiedLanguageServerSettings } from "./server/languageServerSettings";
import { updateStatusBarItems } from "./statusBar";

/**
 * Indica se alguma configuração de `totvsLanguageServer` mudou além do modo
 * de formatação (`totvsLanguageServer.formatter.provider`).
 *
 * Como `affectsConfiguration` não enumera as chaves alteradas, considera-se
 * que houve "outra" mudança quando a seção `totvsLanguageServer` foi afetada
 * mas não exclusivamente a chave de formatação.
 */
function _isOtherTotvsLanguageServerChange(
	e: vscode.ConfigurationChangeEvent
): boolean {
	if (!e.affectsConfiguration("totvsLanguageServer")) {
		return false;
	}
	// A seção mudou; se a mudança de formatação não explica tudo, trata-se de
	// outra configuração. Retornamos true de forma conservadora quando qualquer
	// coisa em totvsLanguageServer muda sem ser a chave de formatação.
	return !e.affectsConfiguration("totvsLanguageServer.formatter.provider")
		? true
		: false;
}

function updateOpenEditors() {
	vscode.window.visibleTextEditors.forEach((element: vscode.TextEditor) => {
		if ((!element.document.isUntitled) &&
			((element.document.languageId == "advpl") || (element.document.languageId == "4gl"))) {
			//TODO: UI ficou ruim, ver como efetuar refresh só do editor
			vscode.commands.executeCommand("workbench.action.reloadWindow");
		}
	});
}

export function registerWorkspace(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
			if (e.affectsConfiguration("totvsLanguageServer") ||
				e.affectsConfiguration("advpl.formatter") ||
				e.affectsConfiguration("4gl.formatter") ||
				e.affectsConfiguration("editor")
			) {
				if (e.affectsConfiguration("totvsLanguageServer.formatter.provider")) {
					applyFormattingMode(context);
				}

				// Detecta se alguma configuração relevante mudou.
				const changed: boolean =
					e.affectsConfiguration("advpl.formatter") ||
					e.affectsConfiguration("4gl.formatter") ||
					e.affectsConfiguration("editor") ||
					e.affectsConfiguration("totvsLanguageServer");

				if (changed) {
					const settings: any[] = getModifiedLanguageServerSettings();

					if (settings.length > 0) {
						sendDidChangeConfiguration(settings).then(() => {
							updateStatusBarItems();
						});
					}

					if (!warningNeedRestart()) {
						languageClient.stop().then(() => {
							languageClient.start();
						});
					};
				}
			}
		}),
		//vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => {
		//	if (e.languageId == "advpl" || e.languageId == "4gl") {
		//		sendDidSaveTextDocument(e.uri.toString(), e.getText());
		//	}
		//}),
		// vscode.workspace.onDidChangeWorkspaceFolders((event: vscode.WorkspaceFoldersChangeEvent) => {
		// 	console.dir(event);
		// }),
		// vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
		// 	console.dir(event);
		// }),
		// vscode.workspace.onDidCreateFiles((event: vscode.FileCreateEvent) => {
		// 	console.dir(event);
		// }),
		// vscode.workspace.onDidDeleteFiles((event: vscode.FileDeleteEvent) => {
		// 	console.dir(event);
		// })
	);

	// Send $advpl/textDocumentDidView. Always send a notification - this will
	// result in some extra work, but it shouldn't be a problem in practice.
	// TODO: O LS não faz nada. Desativado por enquanto.
	// (() => {
	//   window.onDidChangeVisibleTextEditors((visible) => {
	//     for (let editor of visible) {
	//       languageClient.sendNotification("$advpl/textDocumentDidView", {
	//         textDocumentUri: editor.document.uri.toString(),
	//       });
	//     }
	//   });
	// })();

	// const fsw = vscode.workspace.createFileSystemWatcher("**");
	// context.subscriptions.push(fsw);
	// fsw.onDidChange((e: vscode.Uri) => { console.dir(e) });
	// fsw.onDidCreate((e: vscode.Uri) => { console.dir(e) });
	// fsw.onDidDelete((e: vscode.Uri) => { console.dir(e) });
}