export interface IProgramApp {
  name: string;
  date: string;
}

export interface IRpoPatch {
  dateFileGeneration: string;
  buildFileGeneration: string;
  dateFileApplication: string;
  buildFileApplication: string;
  skipOld: boolean;
  typePatch: number;
  programsApp: IProgramApp[];
}

export interface IRpoInfoData {
  rpoVersion: string;
  dateGeneration: string;
  environment: string;
  rpoPatchs: IRpoPatch[];
}

export interface IPatchInfoRequestData {
  error: boolean;
  message: string;
  data: any;
  errorCode?: number;
}

export interface IPatchValidateInfoResult {
  returnCode: number;
  message: string;
  patchValidates: any[];
}