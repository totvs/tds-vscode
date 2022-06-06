const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");

const REPLAY_PATH = path.join(__dirname, "./src/debug/tdsreplay/");
const MONITOR_PATH = path.join(__dirname, "./src/monitor/");
const RPO_INFO_PATH = path.join(__dirname, "./src/rpoInfo/");
const INSPECT_PATCH_PATH = path.join(__dirname, "./src/patch/inspect");
const GENERATE_PATCH_PATH = path.join(__dirname, "./src/patch/generate");
const INSPECTOR_PATH = path.join(__dirname, "./src/inspect-harpia");

module.exports = (env, argv) => {
  const devtool = (argv.mode === 'production') ? false : 'source-map';
  const optimization = argv.mode !== 'production' ? {} : {
    minimize: (argv.mode === 'production'),
    minimizer: [new TerserPlugin()]
  }

  return {
    target: "node",
    devtool: devtool,
    optimization: optimization,
    //O webpack, pega todos os fontes tsx e os compacta em um unico arquivo .js. Isso é feito para contornar algumas limitações e alguns browsers que não aceitam a instrução import.
    //O entry pode ser definido com um objeto. A chave, ou no nome da propriedade, nesse caso sera o nome de saida do arquivo.
    entry: {
      timeLineView: path.join(REPLAY_PATH, "app/index.tsx"),
      monitorPanel: path.join(MONITOR_PATH, "app/index.tsx"),
      rpoInfoPanel: path.join(RPO_INFO_PATH, "app/index.tsx"),
      inspectPatchPanel: path.join(INSPECT_PATCH_PATH, "app/index.tsx"),
      generatePatchPanel: path.join(GENERATE_PATCH_PATH, "app/index.tsx"),
      inspectPanel: path.join(INSPECTOR_PATH, "app/index.tsx"),
    },
    output: {
      //Todos os arquivos tsx serão compilados e gerados seus equivalentes js na mesma pasta
      path: path.resolve(__dirname, "./out/webpack"),
      //O [name] abaixo é o que foi definido no "entry" acima, ou seja, o arquivo gerado tera  o nome timeLineView.js
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
        ".bundle.*.json",
      ],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include: REPLAY_PATH,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.join(REPLAY_PATH, "./app/tsconfig.json"),
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          include: RPO_INFO_PATH,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.join(RPO_INFO_PATH, "./app/tsconfig.json"),
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          include: MONITOR_PATH,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.join(MONITOR_PATH, "./app/tsconfig.json"),
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          include: INSPECT_PATCH_PATH,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.join(INSPECT_PATCH_PATH, "./app/tsconfig.json"),
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          include: GENERATE_PATCH_PATH,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.join(GENERATE_PATCH_PATH, "./app/tsconfig.json"),
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          include: INSPECTOR_PATH,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.join(INSPECTOR_PATH, "./app/tsconfig.json"),
              },
            },
          ],
        },
        {
          test: /\.(bundle\.json|bundle\.*\.json)$/,
          loader: "i18n-loader",
        },

        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        },

        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
          ],
        },
      ],
    },
    performance: {
      hints: "warning",
    },
  }
};
