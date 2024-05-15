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
			dataLanguage[key] = "";
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

function verifyTranslate(language, update) {
	const bundleLanguage = path.join(process.cwd(), "l10n", "bundle.l10n." + language + ".json")
	const contentLanguage = fse.readFileSync(bundleLanguage, { encoding: "utf-8" });
	const dataLanguage = JSON5.parse(contentLanguage);
	let toTranslate = {};
	let count = 0;

	console.info("\n\n>>>> Verifying: " + language);

	for (const key in dataLanguage) {
		if (dataLanguage[key] == key) {
			console.info(key);
			toTranslate[key] = dataLanguage[key];
			count++;
		}
	};

	console.info(">>>> Count: " + count);

	return toTranslate;
}

function verifyDataFiles() {
	console.log("Start check data files");

	verifyResult("es", true);
	verifyResult("ru", true);
	verifyResult("pt-BR", true);

	console.log("End check data files");
}

function verifyNeedTranslate() {
	const toTranslate = {};

	console.log("Start check data files");

	//toTranslate.es = verifyTranslate("es");
	//toTranslate.ru = verifyTranslate("ru");
	toTranslate.pt = verifyTranslate("pt-BR");

	let data = {};
	for (const key in toTranslate.es) {
		data[key] = { "es": toTranslate.es[key] };
	}
	for (const key in toTranslate.ru) {
		data[key] = { "ru": toTranslate.ru[key] };
	}
	for (const key in toTranslate.ru) {
		data[key] = { "pt": toTranslate.pt[key] };
	}

	const csvFile = path.join(process.cwd(), "l10n", "bundle.csv")
	const file = fse.openSync(csvFile, "w");
	fse.writeSync(file, "key,es,ru,pt\n", { encoding: "utf-8" });

	for (const key in data) {
		data[key]["pt"] = key;
		fse.writeSync(file, "\"", { encoding: "utf-8" });
		fse.writeSync(file, key, { encoding: "utf-8" });
		fse.writeSync(file, "\",\"", { encoding: "utf-8" });
		fse.writeSync(file, data[key]["es"] || "@", { encoding: "utf-8" });
		fse.writeSync(file, "\",\"", { encoding: "utf-8" });
		fse.writeSync(file, data[key]["ru"] || "@", { encoding: "utf-8" });
		fse.writeSync(file, "\",\"", { encoding: "utf-8" });
		fse.writeSync(file, data[key]["pt"] || "@", { encoding: "utf-8" });
		fse.writeSync(file, "\"\n", { encoding: "utf-8" });
	}

	fse.closeSync(file);

	console.log("End check data files");
}

//verifyDataFiles();
verifyNeedTranslate();