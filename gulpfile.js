/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const gulp = require("gulp");
var run = require('gulp-run');
const path = require("path");
const vsce = require("@vscode/vsce");
const ts = require("gulp-typescript");
const typescript = require("typescript");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");

const es = require("event-stream");
const nls = require("@vscode/l10n-dev");
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
  return del(["out/**", "out-test/**", "tds-vscode-*.vsix", "totvs.tds-vscode*"]);
};

const cleanLogsTask = function () {
  return del(["./**/*.log", "./**/*.dmp"], {
    onProgress: progress => {
      //      progress.
    }
  });
};

const internalCompileTask = function () {
  return doCompile(false);
};

const internalCompileWebpack = function () {
  return run('npm run compile:views-production').exec();
};

//A opção NODE_ENV=production fara com que os fontes gerados sejam "minificados" e não incluirá os "sourcemaps".
//Para desenvolvimento e debug, talvez seja melhor usar a opção comentada abaixo.
const internalCompileEsBuildProd = function () {
  return run("cross-env NODE_ENV=production node esbuild.js").exec();
  //return run("cross-env NODE_ENV=debug node esbuild.js").exec();
}

// Debug build: no minification, with sourcemaps (esbuild.js, NODE_ENV != production).
const internalCompileEsBuildDebug = function () {
  return run("cross-env NODE_ENV=debug node esbuild.js").exec();
}

const internalNlsCompileTask = function () {
  return doCompile(true);
};

const addL10nTask = function () {
  return run('npx @vscode/l10n-dev export --outDir ./l10n ./src', { verbosity: true }).exec()
  // npx @vscode/l10n-dev export --outDir ./l10n./ src
  // return gulp
  //   .src(["package.nls.json"])
  //   .pipe(nls.createAdditionalLanguageFiles(languages, "i18n"))
  //   .pipe(gulp.dest("."));
};

// Formata com Prettier os arquivos JSON gerados pelo @vscode/l10n-dev em ./l10n.
// Delega ao script npm "l10n:format" para evitar problemas de resolução do
// binário/glob quando executado via gulp-run (cmd.exe) no Windows.
const formatL10nTask = function () {
  return run('npm run l10n:format', { verbosity: true }).exec();
};

const buildTask = gulp.series(cleanTask, internalNlsCompileTask, addL10nTask, formatL10nTask, internalCompileWebpack, internalCompileEsBuildProd);

const doCompile = function (buildNls) {
  var r = tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject());
  //.pipe(buildNls ? nls.rewriteLocalizeCalls() : es.through())
  // .pipe(
  //   buildNls
  //     ? nls.createAdditionalLanguageFiles(languages, "i18n", "out")
  //     : es.through()
  // )
  // .pipe(
  //   buildNls
  //     ? nls.bundleMetaDataFiles("ms-vscode.tds-vscode", "out")
  //     : es.through()
  // )
  //.pipe(buildNls ? nls.bundleLanguageFiles() : es.through());

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

const vscePublishPreReleaseTask = function (done) {
  return vsce.publish({ 'preRelease': true });
};

const vscePackageTask = function () {
  return vsce.createVSIX().then(() => fixVsixPermissions(defaultVsixName()));
};

const vscePackagePreReleaseTask = function () {
  return vsce.createVSIX({ 'preRelease': true }).then(() => fixVsixPermissions(defaultVsixName()));
};

const defaultVsixName = function () {
  const pkg = require("./package.json");
  return `${pkg.name}-${pkg.version}.vsix`;
};

// vsce em Windows grava os binarios Linux/Mac sem bit de execucao (0o666).
// Reescreve o .vsix com 0o755 para os executaveis em bin/linux e bin/mac.
const fixVsixPermissions = async function (vsixPath) {
  const fs = require("fs");
  const JSZip = require("jszip");
  const zip = await JSZip.loadAsync(fs.readFileSync(vsixPath));
  let count = 0;
  zip.forEach((relPath, file) => {
    if (!file.dir && /\/node_modules\/@totvs\/tds-(da|ls)\/bin\/(linux|mac)\//.test(relPath)) {
      file.unixPermissions = 0o755;
      count++;
    }
  });
  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    platform: "UNIX",
    compression: "DEFLATE",
  });
  fs.writeFileSync(vsixPath, buffer);
  log(`Permissao 755 aplicada a ${count} arquivo(s) em ${vsixPath}`);
};

gulp.task("publish", gulp.series(buildTask, vscePublishTask));

gulp.task("publish-prerelease", gulp.series(buildTask, vscePublishPreReleaseTask));

gulp.task("package", gulp.series(buildTask, vscePackageTask));

// Uses .vscodeignore.debug (same as .vscodeignore, but keeps *.map files).
const vscePackageDebugTask = function () {
  const version = require("./package.json").version;
  return vsce.createVSIX({
    ignoreFile: ".vscodeignore.debug",
    packagePath: `tds-vscode-${version}-debug.vsix`,
  }).then(() => fixVsixPermissions(`tds-vscode-${version}-debug.vsix`));
};

gulp.task("package-debug", gulp.series(buildDebugTask, vscePackageDebugTask));

gulp.task("package-prerelease", gulp.series(buildTask, vscePackagePreReleaseTask));

gulp.task("default", buildTask);

gulp.task("clean", cleanTask);

gulp.task("compile", gulp.series(cleanTask, internalCompileTask));

gulp.task("build", buildTask);

gulp.task("cleanLogs", cleanLogsTask);

const internalExportL10n = function () {
  return run('npx @vscode/l10n-dev export --outDir ./l10n ./src', { verbosity: true }).exec()
};

const internalGenerateXlf = function () {
  return run('npx @vscode/l10n-dev generate-xlf ./package.nls.json ./l10n/bundle.l10n.json --outFile vscode-git.xlf', { verbosity: true }).exec()
};

const internalImportXlf = function (translationFile) {
  return run('npx @vscode/l10n-dev import-xlf ' + translationFile, { verbosity: true }).exec();
};

gulp.task(
  "export-l10n",
  gulp.series(internalExportL10n, formatL10nTask, internalGenerateXlf)
);

gulp.task("l10n-import", (done) => {
  return es.merge(
    languages.map((language) => {
      const id = language.id;
      log(`Processing ${id}`);
      return gulp
        .pipe(internalImportXlf(language))
        .on("end", () => done());
    })
  );
});


/*
OBSOLETE code
>>> begin
*/
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
/*
<<< end
OBSOLETE code
*/
function runTX(prefix, args) {
  const { execFile, spawn } = require("child_process");

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
