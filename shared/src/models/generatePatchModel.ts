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

import { TAbstractModelPanel } from "../panels/panelInterface";
import { CommonCommandFromWebViewEnum } from "../webviewProtocol";
import { TInspectorObject } from "./inspectObjectModel";

export enum PatchGenerateCommandEnum {
	IncludeTRes = "INCLUDE_TRES",
	MoveElements = "MOVE_ELEMENTS",
	ImportTxt = "IMPORT_TXT",
}

export type PatchGenerateCommand = CommonCommandFromWebViewEnum & PatchGenerateCommandEnum;

export type TGeneratePatchFromRpoModel = TAbstractModelPanel & {
	isReady: boolean;
	patchName: string;
	patchDest: string;
	includeTRes: boolean;
	objectsLeft: TInspectorObject[];
	objectsRight: TInspectorObject[];
	folder: string;
}

export type TGeneratePatchByDifferenceModel = TAbstractModelPanel & {
	rpoMasterFolder: string;
	patchName: string;
	patchDest: string;
}

export function EMPTY_GENERATE_PATCH_FROM_RPO_MODEL(): TGeneratePatchFromRpoModel {
	return {
		isReady: false,
		patchDest: "",
		patchName: "",
		includeTRes: false,
		objectsLeft: [],
		objectsRight: [],
		folder: ""
	};
}