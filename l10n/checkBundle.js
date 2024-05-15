const fse = require("fs-extra");
const path = require("path")
const JSON5 = require('json5');

function bundleI18n(language) {
	const files = getLanguageFile(language);
	var dataFile = [];

	files.forEach((file) => {
		var contentFile;

		try {
			contentFile = fse.readFileSync(file, { encoding: "utf-8" });
		} catch (error) {
			contentFile = fse.readFileSync(file, { encoding: "ascii" });
		}
		dataFile = JSON5.parse(contentFile);
	})

	return dataResult;
}

function verifyResult(language, update) {
	const master = path.join(process.cwd(), "l10n", "bundle.l10n.json")
	const contentMaster = fse.readFileSync(master, { encoding: "utf-8" });
	const bundleLanguage = path.join(process.cwd(), "l10n", "bundle.l10n." + language + ".json")
	const contentLanguage = fse.readFileSync(bundleLanguage, { encoding: "utf-8" });
	const dataMaster = JSON5.parse(contentMaster);
	const dataLanguage = JSON5.parse(contentLanguage);
	var updateLanguage = false;

	console.info("\n\nVerifying: " + language);

	for (const key in dataMaster) {
		if (!dataLanguage[key]) {
			console.info(key + " not in " + language);
			dataLanguage[key] = dataMaster[key];
			updateLanguage = true;
		}
	};

	for (const key in dataLanguage) {
		if (!dataMaster[key]) {
			console.info(key + " not in MASTER");
			delete dataLanguage[key];
			updateLanguage = true;
		}
	};

	if (update && updateLanguage) {
		console.log(">>>> Updating %s", bundleLanguage);
		fse.writeJSONSync(bundleLanguage, dataLanguage, { encoding: "utf-8", spaces: "  " });
	}
}

function main() {
	console.log("Start check data files");

	verifyResult("es", false);
	verifyResult("ru", false);
	verifyResult("pt-BR", false);

	console.log("End check data files");
}

main()