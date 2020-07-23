/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

const gulp = require("gulp");
const path = require("path");
const ts = require("gulp-typescript");
const log = require("gulp-util").log;
const typescript = require("typescript");
const sourcemaps = require("gulp-sourcemaps");
const tslint = require("gulp-tslint");
const nls = require("vscode-nls-dev");
const del = require("del");
const fs = require("fs");
const vsce = require("vsce");
const es = require("event-stream");
const minimist = require("minimist");
const { getRulesDirectories } = require("tslint/lib/configuration");

const translationExtensionName = "totvs-developer-studio";

const defaultLanguages = [
  { id: "es", folderName: "esn" },
  { id: "ru", folderName: "rus" },
  { id: "pt-br", folderName: "ptb", transifexId: "pt_BR" },
];

const watchedSources = ["src/**/*", "test/**/*"];

const scripts = [
  //'src/terminateProcess.sh'
];

const lintSources = ["src"].map((tsFolder) => tsFolder + "/**/*.ts");

const tsProject = ts.createProject("./src/tsconfig.json", {
  jsx: "react",
  target: "ES5",
  esModuleInterop: true,
});

function doBuild(buildNls, failOnError) {
  return () => {
    let gotError = false;
    const tsResult = tsProject
      .src()
      .pipe(sourcemaps.init())
      .pipe(tsProject())
      .once("error", () => {
        gotError = true;
      });

    return tsResult.js
      .pipe(buildNls ? nls.rewriteLocalizeCalls() : es.through())
      .pipe(
        buildNls
          ? nls.createAdditionalLanguageFiles(defaultLanguages, "i18n", "out")
          : es.through()
      )
      .pipe(
        buildNls
          ? nls.bundleMetaDataFiles("ms-vscode.totvs-developer-studio", "out")
          : es.through()
      )
      .pipe(buildNls ? nls.bundleLanguageFiles() : es.through())
      .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: ".." })) // .. to compensate for TS returning paths from 'out'
      .pipe(gulp.dest("out"))
      .once("error", () => {
        gotError = true;
      })
      .once("finish", () => {
        if (failOnError && gotError) {
          process.exit(1);
        }
      });
  };
}

gulp.task("clean", () => {
  return del(["out/**", "tds-vscode-*.vsix"]);
});

gulp.task("_dev-build", doBuild(false, false));

gulp.task("_build", doBuild(true, true));

gulp.task("build", gulp.series("clean", "_build"));

gulp.task(
  "i18n-export",
  gulp.series(function () {
    return gulp
      .src([
        "package.nls.json",
        "out/nls.metadata.header.json",
        "out/nls.metadata.json",
      ])
      .pipe(nls.createXlfFiles("tds-vscode", "tds-vscode"))
      .pipe(gulp.dest(path.join(".", "tds-vscode-translations")));
  }),
  "build"
);

gulp.task("i18n-import", (done) => {
  return es.merge(
    defaultLanguages.map((language) => {
      const id = language.transifexId || language.id;
      log(language.folderName);
      return gulp
        .src([
          path.join(
            ".",
            "tds-vscode-translations",
            "tds-vscode",
            `tds-vscode.${id}.xlf`
          ),
        ])
        .pipe(nls.prepareJsonFiles())
        .pipe(gulp.dest(path.join("./i18n", language.folderName)))
        .on("end", () => done());
    })
  );
});

function runTX(prefix, args) {
  const { execFile } = require("child_process");
  const ls = execFile("C:\\Python27\\Scripts\\tx.exe", args);

  ls.stdout.on("data", (data) => {
    log(`${prefix}:${data}`);
  });

  ls.stderr.on("data", (data) => {
    log(`${prefix}:${data}`);
  });

  ls.on("close", (code) => {
    log(`${prefix}: tx process close all stdio with code ${code}`);
  });

  ls.on("exit", (code) => {
    log(`${prefix}: tx process exited with code ${code}`);
  });

  return ls;
}

gulp.task("transifex-upload", function (done) {
  const ls = runTX("upload", ["-d", "push", "--source", "-t"]);

  return done();
});

gulp.task("transifex-download", function (done) {
  const ls = runTX("download", ["-d", "pull", "-a", "--skip"]);

  return done();
});

//CUIDADO: as configurações existentes em .tx\config são removidas
//para apagar o recurso sem afetar a configuração, faça via o sitio
gulp.task("transifex-delete", function (done) {
  const ls = runTX("delete", [
    "-d",
    "delete",
    "-f",
    "-r",
    "tds-vscode-brodao.*",
  ]);

  return done();
});
