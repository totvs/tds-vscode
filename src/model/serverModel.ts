export type TServerType =
	| "totvs_server_protheus"
	| "totvs_server_logix"
	| "totvs_server_totvstec";


export type TServerModel = {
	id?: string;  //undefined indica que não foi salvo
	serverType: TServerType;
	serverName: string;
	port: number;
	address: string;
	buildVersion: string;
	secure: boolean;
	includePaths: {
		id: string;
		path: string;
	}[]
}