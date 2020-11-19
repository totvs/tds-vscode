import { type } from "os";

export type OptionStatus =
  "loaded" | "validating" | "valid" | "applying" | "applyed" | "error" | "applyOldResource" | "cancelApply" | "warning";

export const PATCH_ERROR_CODE = {
  OK: 0,
  RETURN_UNDEFINED: 1,
  INVALID_RETURN:  2,
  INSUFICIENT_PRIVILEGES:  3,
  GENERIC_ERROR:  4,
  OLD_RESOURCES:  5,
  EMPTY_EMPFIL_LIST:  6,
}

export interface IPatchFileInfo {
  status: OptionStatus;
  name: string;
  fullpath: string;
  size: number;
  zipFile: string;
  message: string;
  applyOld: boolean
  data: { error_number: number; data: string};
}

export interface IApplyPatchData {
  validateProcess: boolean;
  patchFiles: IPatchFileInfo[];
  lastFolder: string;
  historyFolder: string[];
}
