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

export interface IPatchValidateData {
  file: string;
  datePatch: string;
  dateRpo: string;
};

export interface IPatchValidateResult {
  error: boolean;
  message: string;
  patchValidates?: IPatchValidateData[];
  errorCode: number;
}
