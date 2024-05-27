import { TModelPanel } from "../panels/panelInterface";

export type TWebServiceModel = TModelPanel & {
	urlOrWsdlFile: string;
	outputPath: string;
	outputFilename: string;
	overwrite: boolean
}