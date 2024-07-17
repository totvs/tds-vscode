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
  "build"
));

const SOURCE_FOLDER = path.resolve(path.join(
  __dirname,
  "src"
));

const ADD_SERVER_PATH = path.join(SOURCE_FOLDER, "addServer");
const GLOBAL_INCLUDE_PATH = path.join(SOURCE_FOLDER, "globalInclude");
const GENERATE_WS_PATH = path.join(SOURCE_FOLDER, "generateWs");
const PATCH_GENERATE_PATH = path.join(SOURCE_FOLDER, "patchGenerate");
const PATCH_GENERATE_BY_DIFFERENCE_PATH = path.join(SOURCE_FOLDER, "patchGenerateByDifference");
const COMPILE_KEY_PATH = path.join(SOURCE_FOLDER, "compileKey");
const APPLY_PATCH_PATH = path.join(SOURCE_FOLDER, "applyPatch");
const INSPECT_OBJECT_PATH = path.join(SOURCE_FOLDER, "inspectObject");
const EDITOR_PATCH_PATH = path.join(SOURCE_FOLDER, "editorPatch");
const REPOSITORY_LOG_PATH = path.join(SOURCE_FOLDER, "repositoryLog");
const BUILD_RESULT_PATH = path.join(SOURCE_FOLDER, "buildResult");
const LAUNCHER_CONFIGURATION_PATH = path.join(SOURCE_FOLDER, "launcher");
const REPLAY_CONFIGURATION_PATH = path.join(SOURCE_FOLDER, "replay");
const IMPORT_SOURCES_ONLY_RESULT_PATH = path.join(SOURCE_FOLDER, "importSourcesOnlyResult");
const REPLAY_TIMELINE_PATH = path.join(SOURCE_FOLDER, "replay-timeline");

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
  }

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
      path: path.resolve(BUILD_FOLDER),
      //O [name] abaixo é o que foi definido no "entry" acima, ou seja, o arquivo gerado tera o nome do 'entry'
      filename: "[name].js",
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
      alias: {
        react: path.resolve('./node_modules/react')
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                //                configFile: path.join(REPLAY_PATH, "./app/tsconfig.json"),
              },
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


  return [webviewConfig]
};
