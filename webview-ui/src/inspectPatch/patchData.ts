export interface IPatchData {
	filename: string;
	lengthFile: number;
	patchInfo: any;
  }

  export const EmptyPatchData: IPatchData = {
	filename: "",
	lengthFile: 0,
	patchInfo: []
  }
