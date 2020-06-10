import * as fs from "fs";
import * as path from "path";
import { DocumentFormatting, resourceFormatting } from "./documentFormatting";
import { AdvplFormattingRules } from "./advplFormattingRules";
import Utils from "../utils";

export const documentFormatting = (resources: string[]) => {
	const resourceList: string[] = getResourceList(resources);
	const advplResources: string[] = resourceList.filter((resource: string) => Utils.isAdvPlSource(resource));
	const fourglResources: string[] = resourceList.filter((resource: string) => Utils.is4glSource(resource));

	// resourceFormatting(advplResources);
	// resourceFormatting(fourglResources);
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

import { register as R4gl} from "./fourglFormatting";
import { register as RAdvpl} from "./advplFormatting";

export const register4glFormatting = () => R4gl({language: "4gl" });
export const registerAdvplFormatting = () => RAdvpl({language: "advpl" });
