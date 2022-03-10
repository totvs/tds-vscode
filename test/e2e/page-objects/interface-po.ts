import {
  ICompileKeyScenarioSchema,
  IIncludeScenarioSchema,
  IServerScenarioSchema,
  IUserDataScenarioSchema,
} from "../scenario";

export interface IServerData extends IServerScenarioSchema {}

export interface IUserData extends IUserDataScenarioSchema {}

export interface IIncludeData extends IIncludeScenarioSchema {}

export interface ICompileKeyData extends ICompileKeyScenarioSchema {}

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
