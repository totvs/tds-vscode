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
          ? nls.createAdditionalLanguageFiles(defaultLanguages, "i18n", "src")
          : es.through()
      )
      .pipe(
        buildNls
          ? nls.bundleMetaDataFiles("ms-vscode.totvs-developer-studio", "src")
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
  return del([
    "out/**",
    "tds-vscode-*.vsix",
  ]);
});

gulp.task("_dev-build", doBuild(false, false));

gulp.task("_build", doBuild(true, true));

gulp.task("build", gulp.series("clean", "_build"));

function verifyNotALinkedModule(modulePath) {
  return new Promise((resolve, reject) => {
    fs.lstat(modulePath, (err, stat) => {
      if (stat.isSymbolicLink()) {
        reject(new Error("Symbolic link found: " + modulePath));
      } else {
        resolve();
      }
    });
  });
}

function verifyNoLinkedModules() {
  return new Promise((resolve, reject) => {
    fs.readdir("./node_modules", (err, files) => {
      Promise.all(
        files.map((file) => {
          const modulePath = path.join(".", "node_modules", file);
          return verifyNotALinkedModule(modulePath);
        })
      ).then(resolve, reject);
    });
  });
}

gulp.task("verify-no-linked-modules", (cb) =>
  verifyNoLinkedModules().then(() => cb, cb)
);

gulp.task("vsce-publish", () => {
  return vsce.publish();
});

gulp.task("vsce-package", () => {
  const cliOptions = minimist(process.argv.slice(2));
  const packageOptions = {
    packagePath: cliOptions.packagePath,
  };

  return vsce.createVSIX(packageOptions);
});

gulp.task("add-i18n", () => {
  return gulp
    .src(["package.nls.json"])
    .pipe(nls.createAdditionalLanguageFiles(defaultLanguages, "i18n"))
    .pipe(gulp.dest("."));
});

gulp.task("publish", gulp.series("build", "add-i18n", "vsce-publish"));

gulp.task("package", gulp.series("build", "add-i18n", "vsce-package"));

gulp.task(
  "translations-export",
  gulp.series("build", () => {
    return gulp
      .src(["out/**/nls.bundle.*.json", "out/**/nls.bundle.json"])
      .pipe(nls.createKeyValuePairFile())
      .pipe(gulp.dest("./tds-vscode-translations"));
  })
);

gulp.task("translations-import", (done) => {
  const options = minimist(process.argv.slice(2), {
    string: "location",
    default: {
      location: "./tds-vscode-translations",
    },
  });
  return es
    .merge(
      defaultLanguages.map((language) => {
        let id = language.transifexId || language.id;
        console.log(
          path.join(
            options.location,
            `nls.bundle.${id}.json`
          )
        );
        return gulp
          .src(
            path.join(
              `nls.bundle.${id}.json`
              ), {cwd: options.location}
          )
          .pipe(gulp.dest(path.join("./i18n", language.folderName))
          .pipe(nls.createMetaDataFiles()));
      })
    )
    .on("end", () => done());
});

gulp.task("i18n-import", () => {
  return es.merge(
    defaultLanguages.map((language) => {
      return gulp
        .src(
          "./tds-vscode-translations/*.json"
        )
        .pipe(nls.prepareJsonFiles())
        .pipe(gulp.dest(path.join("./i18n", language.folderName)));
    })
  );
});

const transifexExtensionName = translationExtensionName; // your resource name in Transifex

//
//Arquivo Xlf, somente para planos empresarias
//
// gulp.task('transifex-push', function() {
//     return gulp.src(['**/*.nls.json',"**/*.nls.bundle.json"])
// 		.pipe(nls.createXlfFiles(transifexProjectName, transifexExtensionName))
// 		.pipe(nls.pushXlfFiles(transifexApiHostname, transifexApiName, transifexApiToken));
// });
//
// gulp.task('transifex-pull', function() {
// 	return nls.pullXlfFiles(transifexApiHostname, transifexApiName, transifexApiToken, vscodeLanguages, [{ name: transifexExtensionName, project: transifexProjectName }])
// 		.pipe(gulp.dest(`../${transifexExtensionName}-localization`));
// });
////////////////////////////////////////////////////////

gulp.task("transifex-put", function (done) {
  const { execFile } = require("child_process");
  const ls = execFile("C:\\Python27\\Scripts\\tx.exe", [
    "-d",
    "push",
    "--source",
    "-t",
  ]);

  ls.stdout.on("data", (data) => {
    console.log(data);
  });

  ls.stderr.on("data", (data) => {
    console.log(data);
  });

  ls.on("close", (code) => {
    console.log(`tx process close all stdio with code ${code}`);
  });

  ls.on("exit", (code) => {
    console.log(`tx process exited with code ${code}`);
  });

  return done();
});

gulp.task("transifex-get", function (done) {
  const { execFile } = require("child_process");
  const ls = execFile("C:\\Python27\\Scripts\\tx.exe", [
    "-d",
    "pull",
    "-a",
    "--skip",
  ]);

  ls.stdout.on("data", (data) => {
    console.log(data);
  });

  ls.stderr.on("data", (data) => {
    console.log(data);
  });

  ls.on("close", (code) => {
    console.log(`tx process close all stdio with code ${code}`);
  });

  ls.on("exit", (code) => {
    console.log(`tx process exited with code ${code}`);
  });

  return done();
});

//CUIDADO: O arquivo .tx\config é modificado, removendo as configurações existentes
gulp.task("transifex-delete", function (done) {
  const { execFile } = require("child_process");
  const ls = execFile("C:\\Python27\\Scripts\\tx.exe", [
    "-d",
    "delete",
    "-f",
    "-r",
    "tds-vscode-brodao.*",
  ]);

  ls.stdout.on("data", (data) => {
    console.log(data);
  });

  ls.stderr.on("data", (data) => {
    console.log(data);
  });

  ls.on("close", (code) => {
    console.log(`tx process close all stdio with code ${code}`);
  });

  ls.on("exit", (code) => {
    console.log(`tx process exited with code ${code}`);
  });

  return gulp.done;
});
