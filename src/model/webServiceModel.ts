import { TModelPanel } from "../panels/panel";

export type TWebServiceModel = TModelPanel & {
	urlOrWsdlFile: string;
	outputPath: string;
	outputFilename: string;
	overwrite: boolean
}