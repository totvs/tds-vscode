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

export type TPatchFileData = {
	name: string;
	uri?: string;
	validation: string;
	tphInfo: any;
	isProcessing: boolean;
	fsPath: string;
};

export type TApplyPatchModel = TAbstractModelPanel & {
	serverName: string;
	address: string;
	environment: string;
	patchFiles: TPatchFileData[];
	applyOldFiles: boolean;
}