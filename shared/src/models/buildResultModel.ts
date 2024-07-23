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
import { deepCopy } from './../panels/panelInterface';

export enum BuildResultCommandEnum {
	Export = "EXPORT"
}

export type BuildResultCommand = CommonCommandFromWebViewEnum & BuildResultCommandEnum;


export type TBuildInfoResult = {
	filename: string;
	status: string;
	message: string;
	detail: string;
	uri: string;
}

export type TBuildResultModel = TAbstractModelPanel & {
	timeStamp: Date;
	returnCode: number;
	buildInfos: TBuildInfoResult[];
}

export function EMPTY_BUILD_RESULT_MODEL(): TBuildResultModel {
	return {
		timeStamp: new Date(0),
		returnCode: 0,
		buildInfos: []
	};
}