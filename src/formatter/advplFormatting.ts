import { DocumentFormattingEditProvider, TextDocument, FormattingOptions, CancellationToken, ProviderResult, TextEdit, DocumentRangeFormattingEditProvider } from 'vscode';
import { FormattingRules, RuleMatch } from './formmatingRules';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

class AdvplDocumentFormatting implements DocumentFormattingEditProvider {
	lineContinue: boolean = false;

	provideDocumentFormattingEdits(document: TextDocument,
		options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]> {

		const formattingRules = new FormattingRules();
		const tab: string = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';
		let identBlock: string = "";
		let cont: number = 0;

		let result: TextEdit[] = [];
		const lc = document.lineCount;

		for (let nl = 0; nl < lc; nl++) {
			const line = document.lineAt(nl);

			if ((!line.isEmptyOrWhitespace) && (formattingRules.match(line.text))) {
				let ruleMatch: RuleMatch | null = formattingRules.getLastMatch();

				if (ruleMatch) {
					if (ruleMatch.decrement) {
						cont = cont < 1 ? 0 : cont - 1;
						identBlock = tab.repeat(cont);
					}
				}

				const newLine: string = line.text.replace(/(\s*)?/, identBlock + (this.lineContinue ? tab : "")).trimRight();
				result.push(TextEdit.replace(line.range, newLine));
				this.lineContinue = newLine.endsWith(';');

				if (ruleMatch) {
					if (ruleMatch.increment) {
						cont++;
						identBlock = tab.repeat(cont);
					}
				}
			} else {
				let newLine: string = '';
				if (!line.isEmptyOrWhitespace) {
					newLine = line.text.replace(/(\s*)?/, identBlock + (this.lineContinue ? tab : "")).trimRight();
				}
				result.push(TextEdit.replace(line.range, newLine));
				this.lineContinue = newLine.endsWith(';');
			}
		}

		return result;
	}
}

class AdvplDocumentRangeFormatting implements DocumentRangeFormattingEditProvider {

	provideDocumentRangeFormattingEdits(document: TextDocument, range: import("vscode").Range, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]> {
		throw new Error("Method not implemented.");
	}
}

const advplDocumentFormatter = new AdvplDocumentFormatting();
const advplDocumentRangeFormatter = new AdvplDocumentRangeFormatting();

export function advplDocumentFormattingEditProvider() {
	return advplDocumentFormatter;
}

export function advplDocumentRangeFormattingEditProvider() {
	return advplDocumentRangeFormatter;
}

export function advplResourceFormatting(resources: string[]) {
	const targetResources: string[] = getResourceList(resources);

	if (targetResources.length === 0) {
		vscode.window.showInformationMessage("Nenhum recurso localizado.");
	} else {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Window,
			title: "Formatação",
			cancellable: true
		}, (progress, token) => {
			token.onCancellationRequested(() => {
				vscode.window.showWarningMessage("Formatação de recursos cancelada.");
			});
			const total = targetResources.length;
			const increment: number = 100 / total;

			targetResources.forEach((resource: string, index) => {
				let uri: vscode.Uri = vscode.Uri.file(resource);
				const relPath = path.relative(resource, uri.toString(false));
				progress.report({ increment: increment, message: `${relPath} (${index + 1}/${total})` });

				vscode.workspace.openTextDocument(uri).then((document: TextDocument) => {
					if (document.languageId === "advpl") {
						const options: FormattingOptions = {
							insertSpaces: false,
							tabSize: 4
						};

						const providerResult: ProviderResult<TextEdit[]> = advplDocumentFormatter.provideDocumentFormattingEdits(document, options, token);
						if (Array.isArray(providerResult)) {
							const wsEdit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
							wsEdit.set(uri, providerResult);
							vscode.workspace.applyEdit(wsEdit).then((value:boolean) => {
								if (!value) {
									vscode.window.showErrorMessage("falhou");
								}
							});
						}
					}

					const p = new Promise(resolve => {
						setTimeout(() => {
							resolve();
						}, 2000);
					});

					return p;
				});
			});

			const p = new Promise(resolve => {
				setTimeout(() => {
					resolve();
				}, 5000);
			});

			return p;
		});
	}
}

function getResourceList(resources: string[]): string[] {
	const resultList: string[] = [];

	resources.forEach((resourcePath: string) => {
		const fi: fs.Stats = fs.lstatSync(resourcePath);
		if (fi.isDirectory()) {
			let filenames = fs.readdirSync(resourcePath).map<string>((filename: string) => {
				return path.join(resourcePath, filename);
			});
			resultList.push(...getResourceList(filenames));
		} else {
			resultList.push(resourcePath);
		}
	});

	return resultList;
}
