import * as vscode from "vscode";

export type TPatchFileData = {
	name: string;
	uri: vscode.Uri | undefined;
	validation: string;
	tphInfo: any;
	isProcessing: boolean;
};

