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