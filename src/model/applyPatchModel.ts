import * as vscode from "vscode";
import { TModelPanel } from "../panels/panel";


export type TPatchFileData = {
	name: string;
	uri: vscode.Uri;
	validation: string;
	tphInfo: any;
	isProcessing: boolean;
	fsPath: string;
};

export type TApplyPatchModel = TModelPanel & {
	serverName: string;
	address: string;
	environment: string;
	patchFiles: TPatchFileData[];
	applyOldFiles: boolean;
}