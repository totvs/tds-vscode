import { type } from "os";

export type OptionsStatus =
  "loaded" | "validating" | "valid" | "applying" | "applyed" | "error" | "cancelApply" | "warning";

export const PATCH_ERROR_CODE = {
  OK: 0,
  RETURN_UNDEFINED: 1,
  INVALID_RETURN:  2,
  INSUFICIENT_PRIVILEGES:  3,
  GENERIC_ERROR:  4,
  OLD_RESOURCES:  5,
  EMPTY_EMPFIL_LIST:  6,
  APPLY_DENIED:  7,
}

export type IApplyScope = "none" | "only_new" | "all";

export interface IPatchFileInfo {
  status: OptionsStatus;
  name: string;
  fullpath: string;
  size: number;
  zipFile: string;
  message: string;
  applyScope: IApplyScope;
  data: { error_number: number; data: any};
}

export interface IApplyPatchData {
  validateProcess: boolean;
  patchFiles: IPatchFileInfo[];
  lastFolder: string;
  historyFolder: string[];
}
