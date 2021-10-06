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
}

export interface IIncludeData {
	includePath: string[];
}

export interface ICompileKeyData {
	machineId: string;
	compileKeyFile: string;
	key: string;
	generatedIn: string;
	expireIn: string;
	token: string;
	overwrite: string;
}
