"use strict";

module.exports = {
  recursive: true,
  reporter: "spec",
  slow: 75,
  timeout: 5 * 60000,
  ui: "bdd",
  "async-only": true,
  color: false,
  "full-trace": true,
  jobs: 1,
  sort: true,
  "dry-run": false,
  "fail-zero": false,

  //growl: true, //não consegui fazer funcionar
  ////////////////////
  // require: "common-hooks.js", usado em execução paralela
  // "fgrep": "" //   Only run tests containing this string                   [string]
  // "grep": "" //    Only run tests matching this string or regexp           [string]
  // "invert": false //  Inverts --grep and --fgrep matches                     [boolean]

  //
  //ignore: ["test/e2e/activity-bar/**"],
  //"allow-uncaught": false,
  //bail: false,
  //"check-leaks": false,
  //delay: true,
  //diff: true,
  //exit: false, // could be expressed as "'no-exit': true"
  //extension: ["js"],
  //"fail-zero": true,
  //fgrep: "something", // fgrep and grep are mutually exclusive
  //file: ["/path/to/some/file", "/path/to/some/other/file"],
  //"forbid-only": false,
  //"forbid-pending": false,
  //global: ["jQuery", "$"],
  //grep: /something/i, // also 'something', fgrep and grep are mutually exclusive
  //growl: false,
  //"inline-diffs": false,
  // invert: false, // needs to be used with grep or fgrep
  //"node-option": ["unhandled-rejections=strict"], // without leading "--", also V8 flags
  //package: "./package.json",
  //parallel: false,
  //recursive: true,
  //reporter: "spec",
  //"reporter-option": ["foo=bar", "baz=quux"], // array, not object
  //require: "@babel/register",
  //retries: 1,
  //slow: "75",
  //sort: false,
  //spec: ["test/**/*.spec.js"], // the positional arguments!
  //timeout: "30000", // same as "timeout: '2s'"
  // timeout: false, // same as "timeout: 0"
  //"trace-warnings": true, // node flags ok
  //"v8-stack-trace-limit": 100, // V8 flags are prepended with "v8-"
  //watch: false,
  //"watch-files": ["lib/**/*.js", "test/**/*.js"],
  //"watch-ignore": ["lib/vendor"],
};
