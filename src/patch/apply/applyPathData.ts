import { type } from "os";

export type OptionStatus =
  "loaded" | "validating" | "valid" | "applying" | "applyed" | "error" | "applyOldResource" | "cancelApply" | "warning";

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
