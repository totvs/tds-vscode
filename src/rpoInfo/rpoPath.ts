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

export interface IPatchInfoData {
  process: string;
  error: boolean;
  message: string;
  data: any;
}