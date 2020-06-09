import * as fs from "fs";
import * as path from "path";
import { FourglFormattingRules } from "./fourglFormattingRules";
import { DocumentFormatting, resourceFormatting } from "./documentFormatting";
import { AdvplDocumentRangeFormatting } from "./advplFormatting";
import { AdvplFormattingRules } from "./advplFormattingRules";
import { FourglDocumentRangeFormatting } from "./fourglFormatting";
import { FourglTypingFormatting } from "./fourglTypingFormatting";
import Utils from "../utils";

export const advplDocumentFormatter = new DocumentFormatting(new AdvplFormattingRules());
export const advplDocumentRangeFormatter = new AdvplDocumentRangeFormatting();

export const fourglDocumentFormatter = new DocumentFormatting(new FourglFormattingRules());
export const fourglDocumentRangeFormatter = new FourglDocumentRangeFormatting();
export const fourglTypingFormatting = new FourglTypingFormatting();

export const documentFormatting = (resources: string[]) => {
	const resourceList: string[] = getResourceList(resources);
	const advplResources: string[] = resourceList.filter((resource: string) => Utils.isAdvPlSource(resource));
	const fourglResources: string[] = resourceList.filter((resource: string) => Utils.is4glSource(resource));

	resourceFormatting(advplResources, advplDocumentFormatter);
	resourceFormatting(fourglResources, fourglDocumentFormatter);
}

function getResourceList(resources: string[]): string[] {
	const resultList: string[] = [];

	resources.forEach((resourcePath: string) => {
		const fi: fs.Stats = fs.lstatSync(resourcePath);
		if (fi.isDirectory()) {
			let filenames = fs.readdirSync(resourcePath).map<string>((filename: string) => {
				return path.join(resourcePath, filename);
			});
			resultList.push(...getResourceList(filenames));
		} else {
			resultList.push(resourcePath);
		}
	});

	return resultList;
}
