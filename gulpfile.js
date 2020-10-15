/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const gulp = require("gulp");
const path = require("path");

const ts = require("gulp-typescript");
const typescript = require("typescript");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
//const runSequence = require("run-sequence");
const es = require("event-stream");
const vsce = require("vsce");
const nls = require("vscode-nls-dev");
const log = require("gulp-util").log;
const webpack = require("webpack-stream");

const tsProject = ts.createProject("./src/tsconfig.json", { typescript });

const inlineMap = true;
const inlineSource = false;
const outDest = "out";

// If all VS Code languages are support you can use nls.coreLanguages
const languages = [
  { id: "es", folderName: "esn" },
  { id: "ru", folderName: "rus" },
  { id: "pt-br", folderName: "ptb", transifexId: "pt_BR" },
];

const cleanTask = function () {
  return del(["out/**", "package.nls.*.json", "tds-vscode-*.vsix"]);
};

const internalCompileTask = function () {
  return doCompile(false);
};

const internalNlsCompileTask = function () {
  return doCompile(true);
};

const addI18nTask = function () {
  return gulp
    .src(["package.nls.json"])
    .pipe(nls.createAdditionalLanguageFiles(languages, "i18n"))
    .pipe(gulp.dest("."));
};

const webPack = function () {
  return gulp
    .src("src/entry.js")
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("dist/"));
};

const buildTask = gulp.series(cleanTask, internalNlsCompileTask, addI18nTask);

const doCompile = function (buildNls) {
  var r = tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(buildNls ? nls.rewriteLocalizeCalls() : es.through())
    .pipe(
      buildNls
        ? nls.createAdditionalLanguageFiles(languages, "i18n", "out")
        : es.through()
    )
    .pipe(
      buildNls
        ? nls.bundleMetaDataFiles("ms-vscode.tds-vscode", "out")
        : es.through()
    )
    .pipe(buildNls ? nls.bundleLanguageFiles() : es.through());

  if (inlineMap && inlineSource) {
    r = r.pipe(sourcemaps.write());
  } else {
    r = r.pipe(
      sourcemaps.write("../out", {
        // no inlined source
        includeContent: inlineSource,
        // Return relative source map root directories per file.
        sourceRoot: "../src",
      })
    );
  }

  return r.pipe(gulp.dest(outDest));
};

const vscePublishTask = function () {
  return vsce.publish();
};

const vscePackageTask = function () {
  return vsce.createVSIX();
};

gulp.task("default", buildTask);

gulp.task("clean", cleanTask);

gulp.task("compile", gulp.series(cleanTask, internalCompileTask));

gulp.task("build", buildTask);

gulp.task("publish", gulp.series(buildTask, vscePublishTask));

gulp.task("package", gulp.series(buildTask, vscePackageTask));

gulp.task(
  "export-i18n",
  gulp.series("build", function (done) {
    return gulp
      .src([
        "package.nls.json",
        "out/nls.metadata.header.json",
        "out/nls.metadata.json",
      ])
      .pipe(nls.createXlfFiles("tds-vscode", "tds-vscode"))
      .pipe(gulp.dest(path.join("../tds-vscode-export")))
      .on("end", () => done());
  })
);

gulp.task("i18n-import", (done) => {
  return es.merge(
    languages.map((language) => {
      const id = language.transifexId || language.id;
      log(`Processing ${id}`);
      return gulp
        .src([`../tds-vscode-import/tds-vscode/tds-vscode_${id}.xlf`])
        .pipe(nls.prepareJsonFiles())
        .pipe(gulp.dest(path.join("./i18n", language.folderName)))
        .on("end", () => done());
    })
  );
});

function runTX(prefix, args) {
  const { execFile } = require("child_process");

  const ls = execFile("C:\\Python27\\Scripts\\tx.exe", [, /*"-d"*/ ...args]);

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
  return runTX("upload", ["push", "--source", "-t"]).on("end", () => done());
});

gulp.task("transifex-download", function (done) {
  return runTX("download", ["pull", "-a", "--skip"]).on("end", () => done());
});
