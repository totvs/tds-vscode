import * as vscode from "vscode";
import { workspace, TextDocument, window, MessageOptions } from "vscode";
import { basename } from "path";

export const enum ConfirmResult {
	SAVE,
	DONT_SAVE,
	CANCEL
}

export async function verifyEditorState(): Promise<ConfirmResult> {
	const resourcesToConfirm: TextDocument[] = workspace.textDocuments.filter(d => !d.isUntitled && d.isDirty);
	const count = resourcesToConfirm.length;

	if (count === 0) {
		return Promise.resolve(ConfirmResult.DONT_SAVE);
	}

	const message = resourcesToConfirm.length === 1 ? vscode.l10n.t("Do you want to save the changes you made to {0}?", basename(resourcesToConfirm[0].fileName))
		: getConfirmMessage(vscode.l10n.t("Do you want to save the changes to the following {0} files?", count), resourcesToConfirm);

	const saveAll = vscode.l10n.t("Save All");
	const save = vscode.l10n.t("Save");
	const dontSave = vscode.l10n.t("Don´t save");

	const buttons: string[] = [
		resourcesToConfirm.length > 1 ? saveAll : save,
		dontSave
	];

	const options: MessageOptions = {
		modal: true
	};

	return window.showWarningMessage(message, options, ...buttons).then(index => {
		switch (index) {
			case save || saveAll: return ConfirmResult.SAVE;
			case dontSave: return ConfirmResult.DONT_SAVE;
			default: return ConfirmResult.CANCEL;
		}
	});
}

const MAX_CONFIRM_FILES = 10;
export function getConfirmMessage(start: string, resourcesToConfirm: TextDocument[]): string {
	const message = [start];
	message.push('');
	message.push(...resourcesToConfirm.slice(0, MAX_CONFIRM_FILES).map(r => r.fileName));

	if (resourcesToConfirm.length > MAX_CONFIRM_FILES) {
		if (resourcesToConfirm.length - MAX_CONFIRM_FILES === 1) {
			message.push(vscode.l10n.t("...1 additional file not shown"));
		} else {
			message.push(vscode.l10n.t("...{0} additional files not shown", resourcesToConfirm.length - MAX_CONFIRM_FILES));
		}
	}

	message.push('');
	return message.join('\n');
}