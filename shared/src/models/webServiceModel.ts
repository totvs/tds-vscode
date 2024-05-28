import { TAbstractModelPanel } from "../panels/panelInterface";

export type TWebServiceModel = TAbstractModelPanel & {
	urlOrWsdlFile: string;
	outputPath: string;
	outputFilename: string;
	overwrite: boolean
}