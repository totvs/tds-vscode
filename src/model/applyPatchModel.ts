import * as vscode from "vscode";

import { TModelPanel } from "./field-model";

export type TPatchFileData = {
	name: string;
	uri: vscode.Uri;
	validation: string;
	tphInfo: any;
};

export type TApplyPatchModel = TModelPanel & {
	serverName: string;
	address: string;
	environment: string;
	patchFiles: TPatchFileData[];
	applyOldFiles: boolean;
}