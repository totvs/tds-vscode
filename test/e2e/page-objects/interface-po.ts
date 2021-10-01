export interface IServerData {
	serverName: string;
	address: string;
	port: number;
	includePath: string[];
	environment: string;
}

export interface IUserData {
	username: string;
	password: string;
	compilekey: string;
	rpotoken: string;
}

export interface IIncludeData {
	includePath: string[];
}
