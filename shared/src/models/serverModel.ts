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
import { TIncludePath } from "./includeModel";

export type TServerType = ""
	| "totvs_server_protheus"
	| "totvs_server_logix"
	| "totvs_server_totvstec";

export type TServerModel = TAbstractModelPanel & {
	id?: string;  //undefined indica que não foi salvo
	serverType: TServerType;
	serverName: string;
	port: number;
	address: string;
	buildVersion: string;
	secure: boolean;
	includePaths: TIncludePath[];
	immediateConnection: boolean;
	globalIncludeDirectories: string;
}

export function EMPTY_SERVER_MODEL(): TServerModel {
	return {
		serverType: "totvs_server_protheus",
		serverName: "",
		port: 0,
		address: "",
		includePaths: [],
		immediateConnection: true,
		secure: false,
		buildVersion: "",
		globalIncludeDirectories: ""
	};
}