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

export enum CommonCommandFromWebViewEnum {
	AfterSelectResource = "AFTER_SELECT_RESOURCE",
	Close = "CLOSE",
	Ready = "READY",
	Reset = "RESET",
	Save = "SAVE",
	SaveAndClose = "SAVE_AND_CLOSE",
	SelectResource = "SELECT_RESOURCE",
}

export type CommonCommandFromWebView = CommonCommandFromWebViewEnum;

export enum CommonCommandToWebViewEnum {
	InitialData = "INITIAL_DATA",
	UpdateModel = "UPDATE_MODEL",
}

