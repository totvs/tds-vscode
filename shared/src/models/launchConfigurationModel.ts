import { TAbstractModelPanel } from "../panels/panelInterface";

export type TLauncherType = ""
	| "totvs_language_debug"
	| "totvs_language_web_debug"
	| "totvs_tdsreplay_debug";

export type TLauncherConfigurationModel = TAbstractModelPanel & {
	launcherType: TLauncherType;
	name: string;
	launchersNames: string[];
	program: string;
	programArgs: { value: string }[];
	smartClient: string;
	webAppUrl: string;
	enableMultiThread: boolean;
	enableProfile: boolean;
	multiSession: boolean;
	accessibilityMode: boolean;
	openGlMode: boolean;
	dpiMode: boolean;
	oldDpiMode: boolean;
	language: TLanguagesEnum;
	doNotShowSplash: boolean;
	ignoreFiles: boolean;
}

export enum TLanguagesEnum {
	DEFAULT = "Default",
	PT = "Portuguese",
	EN = "English",
	ES = "Spanish",
	RU = "Russian",
}

export const EMPTY_LAUNCHER_CONFIGURATION: TLauncherConfigurationModel = {
	launcherType: "",
	name: "",
	launchersNames: [],
	program: "",
	programArgs: [],
	smartClient: "",
	webAppUrl: "",
	enableMultiThread: true,
	enableProfile: false,
	multiSession: true,
	accessibilityMode: false,
	openGlMode: false,
	dpiMode: false,
	oldDpiMode: false,
	language: TLanguagesEnum.DEFAULT,
	doNotShowSplash: false,
	ignoreFiles: true,
}