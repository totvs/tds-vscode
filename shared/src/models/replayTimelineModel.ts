
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
import { TImportSourcesOnlyResultData } from "./importSourcesOnlyResultModel";

export enum ReplayTimelineCommandEnum {
	AddTimeLines = 'addTimeLines',
	SelectTimeLine = 'selectTimeLine',
	OpenSourcesDialog = 'openSourcesDialog',
	ShowMessageDialog = 'showMessageDialog',
	SetTimeline = "SetTimeline",
	ChangePage = "ChangePage",
	IgnoreSourceNotFound = "IgnoreSourceNotFound",
	UpdateProgressRing = "UpdateProgressRing"
}

export type ReplayTimelineCommand = CommonCommandFromWebViewEnum & ReplayTimelineCommandEnum;

export type TReplayTimelineData = {
	id: number;
	line: number
	srcFoundInWS: boolean;
	srcName: string;
	timeStamp: string;
}

export type TPaginatorData = {
	currentLine: number;
	currentPage: number;
	firstPageItem: number;
	totalItems: number;
	pageSize: number;
}

export type TReplayTimelineModel = TAbstractModelPanel & {
	paginator: TPaginatorData;
	timeline: TReplayTimelineData[]
	sources: {
		showDialog: boolean;
		sources: TImportSourcesOnlyResultData[];
		selected: string[];
	},
	ignoresSourcesNotFound: boolean;
}

export function EMPTY_REPLAY_TIMELINE_MODEL(): TReplayTimelineModel {
	return {
		ignoresSourcesNotFound: false,
		paginator: {
			currentLine: 0,
			currentPage: 0,
			firstPageItem: 0,
			totalItems: 0,
			pageSize: 0
		},
		timeline: [],
		sources: {
			showDialog: false,
			sources: [],
			selected: []
		}
	};
}