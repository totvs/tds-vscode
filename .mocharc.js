"use strict";

module.exports = {
  recursive: true,
  reporter: "spec",
  slow: 75,
  timeout: 5 * 60000,
  ui: "bdd",
  asyncOnly: true,
  color: false,
  fullTrace: true,
  parallel: false,
  jobs: 1,
  sort: false,
  dryRun: false,
  failZero: true,
  inlineDiffs: false,
  traceWarnings: false, // node flags ok
  //grep: "^LOGIX:", //    Only run tests matching this string or regexp           [string]
  //invert: process.env.SCENARIO.toUpperCase().indexOf("LOGIX") == -1, //  Inverts --grep and --fgrep matches                     [boolean]
  //files: ["/path/to/some/file", "/path/to/some/other/file"],
  //spec: ["test/**/*.spec.js"], // the positional arguments!
  // rootHooks: {
  //   beforeAll: (args) => {
  //     console.log("hook beforeAll");
  //   },
  //   beforeEach: (args) => {
  //     console.log("hook beforeEach");
  //   },
  //   afterAll: (args) => {
  //     console.log("hook afterAll");
  //   },
  //   afterEach: (args) => {
  //     console.log("hook afterEach");
  //   },
  // }
  //fgrep: "" //   Only run tests containing this string                   [string]
  //growl: true, //não consegui fazer funcionar
  ////////////////////
  // require: "common-hooks.js", usado em execução paralela

  //
  //"allow-uncaught": false,
  //bail: false,
  //"check-leaks": false,
  //delay: true,
  //diff: true,
  //exit: false, // could be expressed as "'no-exit': true"
  //extension: ["js"],
  //"fail-zero": true,
  //fgrep: "something", // fgrep and grep are mutually exclusive
  //"forbid-only": false,
  //"forbid-pending": false,
  //global: ["jQuery", "$"],
  //grep: /something/i, // also 'something', fgrep and grep are mutually exclusive
  //growl: false,
  // invert: false, // needs to be used with grep or fgrep
  //"node-option": ["unhandled-rejections=strict"], // without leading "--", also V8 flags
  //package: "./package.json",
  //recursive: true,
  //reporter: "spec",
  //"reporter-option": ["foo=bar", "baz=quux"], // array, not object
  //require: "@babel/register",
  //retries: 1,
  //slow: "75",
  //sort: false,
  //timeout: "30000", // same as "timeout: '2s'"
  // timeout: false, // same as "timeout: 0"
  //"v8-stack-trace-limit": 100, // V8 flags are prepended with "v8-"
  //watch: false,
  //"watch-files": ["lib/**/*.js", "test/**/*.js"],
  //"watch-ignore": ["lib/vendor"],
};
