/*
Copyright 2021-2024 TOTVS S.A

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

export enum LauncherTypeEnum {
	TotvsLanguageDebug = "totvs_language_debug",
	TotvsWebDebug = "totvs_language_web_debug",
	ReplayDebug = "totvs_tdsreplay_debug"
}

export enum LanguagesEnum {
	DEFAULT = "Default",
	POR = "Portuguese",
	ENG = "English",
	SPA = "Spanish",
	RUS = "Russian",
}

export type TDebugDataConfiguration = {
	launcherType: LauncherTypeEnum;
	name: string;
	program: string
	programArgs: { value: string }[]; //necessário como objeto para satisfazer React
	smartClient: string;
	webAppUrl: string;
	enableMultiThread: boolean;
	enableProfile: boolean;
	multiSession: boolean;
	accessibilityMode: boolean;
	openGlMode: boolean;
	dpiMode: boolean;
	oldDpiMode: boolean;
	language: LanguagesEnum;
	doNotShowSplash: boolean;
	ignoreFiles: boolean;
}

export type TDebugConfigurationModel = TAbstractModelPanel & TDebugDataConfiguration & {
	launchers: Record<string, TDebugDataConfiguration>;
}

export type TReplayDataConfiguration = {
	launcherType: LauncherTypeEnum;
	name: string;
	replayFile: string;
	password: string;
	includeSources: { value: string }[]; //necessário como objeto para satisfazer React
	excludeSources: { value: string }[]; //necessário como objeto para satisfazer React
	ignoreFiles: boolean;
	importOnlySourcesInfo: boolean;
}

export type TReplayConfigurationModel = TAbstractModelPanel & TReplayDataConfiguration & {
	launchers: Record<string, TReplayDataConfiguration>;
}

export function EMPTY_DEBUG_DATA_CONFIGURATION(): TDebugDataConfiguration {
	return {
		launcherType: LauncherTypeEnum.TotvsLanguageDebug,
		name: "",
		program: "",
		programArgs: [],
		smartClient: "",
		webAppUrl: "",
		enableMultiThread: false,
		enableProfile: false,
		multiSession: true,
		accessibilityMode: false,
		openGlMode: false,
		dpiMode: false,
		oldDpiMode: false,
		language: LanguagesEnum.DEFAULT,
		doNotShowSplash: false,
		ignoreFiles: true
	};
}

export function EMPTY_DEBUG_CONFIGURATION(): TDebugConfigurationModel {
	return {
		...EMPTY_DEBUG_DATA_CONFIGURATION(),
		launchers: {},
	};
}

export function EMPTY_REPLAY_DATA_CONFIGURATION(): TReplayDataConfiguration {
	return {
		launcherType: LauncherTypeEnum.ReplayDebug,
		name: "",
		replayFile: "",
		password: "",
		includeSources: [],
		excludeSources: [],
		ignoreFiles: true,
		importOnlySourcesInfo: false
	};
}

export function EMPTY_REPLAY_CONFIGURATION(): TReplayConfigurationModel {
	return {
		...EMPTY_REPLAY_DATA_CONFIGURATION(),
		launchers: {},
	};
}