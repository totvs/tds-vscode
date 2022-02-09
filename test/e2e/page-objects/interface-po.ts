export interface IServerData {
  serverType: "totvs_server_protheus" | "totvs_server_logix";
  serverName: string;
  address: string;
  port: number;
  includePath: string[];
  environment: string;
  smartClientBin: string;
}

export interface IUserData {
  username: string;
  password: string;
}

export interface IIncludeData {
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
  excludeSrcID: string;
  ignoreSourcesNotFoundID: boolean;
  TDSReplayFile: string;
  launcherName: string;
  forceImport: boolean;
}

export interface IMonitorConnectionsData {
  server: string;
  appUser: string;
  environment: string;
  computerName: string;
  threadId: string;
  mainName: string;
  remark: string;
}

export interface IMonitorData {
  subtitle: string;
  connections: IMonitorConnectionsData[];
}
