import { DocumentFormattingEditProvider, TextDocument, FormattingOptions, CancellationToken, ProviderResult, TextEdit, DocumentRangeFormattingEditProvider, Uri } from 'vscode';
import { FormattingRules, RuleMatch } from './formmatingRules';
import * as fs from 'fs';
import * as vscode from 'vscode';

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

export function advplResourceFormatting(uriList: Uri[]) {
	uriList.forEach((uri: Uri) => {
		const fi: fs.Stats = fs.lstatSync(uri.fsPath);
		if (fi.isDirectory) {
			let filenames = fs.readdirSync(uri.fsPath);
			let subUri: Uri[] = filenames.map<Uri>((elemen: string) => {
				return Uri.parse(elemen);
			});
			advplResourceFormatting(subUri);
		} else {
			vscode.workspace.openTextDocument(uri).then((document: TextDocument) => {
				console.log(`>>> formatar ${uri}`);
			});
		}
	});
}
