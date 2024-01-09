import { TIncludePath, TModelPanel } from "./field-model";

export type TWebServiceModel = TModelPanel & {
	urlOrWsdlFile: string;
	outputPath: string;
	outputFilename: string;
	overwrite: boolean
}