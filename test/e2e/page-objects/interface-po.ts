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
  valid: string[];
  toChange: string[];
  toAdd: string[];
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


export interface IReplayData {
  passwordID: string;
  includeSrcID: string;
  excluseSrcID: string;
  ignoraSourceNotFoundID: boolean;
  TDSReplayFile: string;
  launcherName: string;

}