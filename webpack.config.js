//@ts-check

"use strict";
const path = require("path");
//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const TerserPlugin = require("terser-webpack-plugin");
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const plugins = []; //new MiniCssExtractPlugin()

const BUILD_FOLDER = path.resolve(path.join(
  __dirname,
  "out"
));

const SOURCE_FOLDER_WEBVIEW = path.resolve(path.join(
  __dirname,
  "webview-ui",
  "src"
));

const SHARED_PATH = path.resolve(path.join(
  __dirname,
  "shared",
  "src"
));

const ADD_SERVER_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "addServer");
const GLOBAL_INCLUDE_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "globalInclude");
const GENERATE_WS_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "generateWs");
const PATCH_GENERATE_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "patchGenerate");
const PATCH_GENERATE_BY_DIFFERENCE_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "patchGenerateByDifference");
const COMPILE_KEY_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "compileKey");
const APPLY_PATCH_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "applyPatch");
const INSPECT_OBJECT_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "inspectObject");
const EDITOR_PATCH_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "editorPatch");
const REPOSITORY_LOG_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "repositoryLog");
const BUILD_RESULT_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "buildResult");
const LAUNCHER_CONFIGURATION_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "launcher");
const REPLAY_CONFIGURATION_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "replay");
const IMPORT_SOURCES_ONLY_RESULT_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "importSourcesOnlyResult");
const REPLAY_TIMELINE_PATH = path.join(SOURCE_FOLDER_WEBVIEW, "replay-timeline");

// const MONITOR_PATH = path.join(__dirname, "./src/monitor/");

module.exports = (env, argv) => {
  const production = (argv.mode === 'production') || (env.NODE_ENV === 'production');
  const devtool = production ? false : 'inline-source-map';

  const splitChunks = !production ? {} : {
    //chunks: 'sync',
    // minSize: 20000,
    // minRemainingSize: 0,
    // minChunks: 1,
    // maxAsyncRequests: 30,
    // maxInitialRequests: 30,
    // enforceSizeThreshold: 50000,
    cacheGroups: {
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  };

  const optimization = !production ? {
    splitChunks: splitChunks
  } : {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    splitChunks: splitChunks
  };

  /** @type WebpackConfig */
  const sharedConfig = {
    target: "node",
    devtool: devtool,
    optimization: optimization,
    plugins: plugins,
    //O webpack, pega todos os fontes tsx e os compacta em um único arquivo .js. Isso é feito para contornar algumas limitações e alguns browsers que não aceitam a instrução import.
    //O entry pode ser definido com um objeto. A chave, ou no nome da propriedade, nesse caso sera o nome de saída do arquivo.
    entry: {
      index: path.join(SHARED_PATH, "index.ts"),
    },
    output: {
      //Todos os arquivos tsx serão compilados e gerados seus equivalentes js na mesma pasta
      path: path.resolve(BUILD_FOLDER, "shared"),
      //O [name] abaixo é o que foi definido no "entry" acima, ou seja, o arquivo gerado tera o nome do 'entry'
      filename: "[name].js",
      libraryTarget: 'commonjs2'
    },
    externals: {
      // the vscode-module is created on-the-fly and must be excluded.
      //Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
      vscode: "commonjs vscode",
    },
    resolve: {
      extensions: [
        ".js",
        ".ts",
        ".tsx",
        ".json",
        ".bundle.json",
        ".bundle.*.json"
      ],
    },
    module: {
      rules: [
        // {
        //   test: /\.m?js/,
        //   type: "javascript/auto",
        // },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: true,
          },
        },
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: "ts-loader",
            },
          ],
        },
      ],
    },
    performance: {
      hints: "warning",
    }
  };

  /** @type WebpackConfig */
  const webviewConfig = {
    target: "node",
    devtool: devtool,
    optimization: optimization,
    plugins: plugins,
    //O webpack, pega todos os fontes tsx e os compacta em um único arquivo .js. Isso é feito para contornar algumas limitações e alguns browsers que não aceitam a instrução import.
    //O entry pode ser definido com um objeto. A chave, ou no nome da propriedade, nesse caso sera o nome de saída do arquivo.
    entry: {
      addServerView: path.join(ADD_SERVER_PATH, "index.tsx"),
      globalIncludeView: path.join(GLOBAL_INCLUDE_PATH, "index.tsx"),
      generateWebServiceView: path.join(GENERATE_WS_PATH, "index.tsx"),
      patchGenerateView: path.join(PATCH_GENERATE_PATH, "index.tsx"),
      patchGenerateByDifferenceView: path.join(PATCH_GENERATE_BY_DIFFERENCE_PATH, "index.tsx"),
      compileKeyView: path.join(COMPILE_KEY_PATH, "index.tsx"),
      applyPatchView: path.join(APPLY_PATCH_PATH, "index.tsx"),
      objectInspectorView: path.join(INSPECT_OBJECT_PATH, "index.tsx"),
      editorPatchView: path.join(EDITOR_PATCH_PATH, "index.tsx"),
      repositoryLogView: path.join(REPOSITORY_LOG_PATH, "index.tsx"),
      buildResultView: path.join(BUILD_RESULT_PATH, "index.tsx"),
      launcherConfigurationView: path.join(LAUNCHER_CONFIGURATION_PATH, "index.tsx"),
      replayConfigurationView: path.join(REPLAY_CONFIGURATION_PATH, "index.tsx"),
      importSourcesOnlyResultView: path.join(IMPORT_SOURCES_ONLY_RESULT_PATH, "index.tsx"),
      replayTimelineView: path.join(REPLAY_TIMELINE_PATH, "index.tsx")

      // monitorPanel: path.join(MONITOR_PATH, "app/index.tsx"),
    },
    output: {
      //Todos os arquivos tsx serão compilados e gerados seus equivalentes js na mesma pasta
      path: path.resolve(BUILD_FOLDER, "webview-ui"),
      //O [name] abaixo é o que foi definido no "entry" acima, ou seja, o arquivo gerado tera o nome do 'entry'
      filename: "[name].js",
      libraryTarget: 'commonjs2'
    },
    externals: {
      // the vscode-module is created on-the-fly and must be excluded.
      //Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
      vscode: "commonjs vscode",
    },
    resolve: {
      extensions: [
        ".js",
        ".ts",
        ".tsx",
        ".json",
        ".bundle.json",
        ".bundle.*.json",
        ".bundle.json",
        ".bundle.*.json"
      ],
      alias: {
        react: path.resolve('./node_modules/react'),
        "react-hook-form": path.resolve('./node_modules/react-hook-form'),
        "@vscode-elements": path.resolve('./node_modules/@vscode-elements'),
        "@tds-shared": path.resolve('./out/shared'),
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: "ts-loader",
              // options: {
              //   //                configFile: path.join(REPLAY_PATH, "./app/tsconfig.json"),
              // },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    performance: {
      hints: "warning",
    }
  };

  /** @type WebpackConfig */
  const extensionConfig = {
    target: 'node', // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

    entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    output: {
      // the bundle is stored in the 'out' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
      path: path.resolve(__dirname, 'out'),
      filename: 'extension.js',
      libraryTarget: 'commonjs2'
    },
    externals: {
      vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
      // modules added here also need to be added in the .vscodeignore file
    },
    resolve: {
      // support reading TypeScript and JavaScript files -> https://github.com/TypeStrong/ts-loader
      extensions: ['.ts', '.js'],
      alias: {
        "@tds-shared": path.resolve('./out/shared'),
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader'
            }
          ]
        }
      ]
    },
    devtool: devtool,
    infrastructureLogging: {
      level: "log", // enables logging required for problem matchers
    },
  };

  return [sharedConfig, extensionConfig, webviewConfig
  ];
};
