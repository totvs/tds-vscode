const path = require("path");

module.exports = {
  target: 'node',
  //O webpack, pega todos os fontes tsx e os compacta em um unico arquivo .js. Isso é feito para contornar algumas limitações e alguns browsers que não aceitam a instrução import.
  //O entry pode ser definido com um objeto. A chave, ou no nome da propriedade, nesse caso sera o nome de saida do arquivo.
  entry: {
    timeLineView: "./src/debug/tdsreplay/app/index.tsx"
  },
  output: {
    //Todos os arquivos tsx serão compilados e gerados seus equivalentes js na mesma pasta
    path: path.resolve(__dirname, "./out/webpack"),
    //O [name] abaixo é o que foi definido no "entry" acima, ou seja, o arquivo gerado tera  o nome timeLineView.js
    filename: "[name].js"
  },
  devtool: "eval-source-map",
  externals: {
    vscode: 'commonjs vscode'
    // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"]
  },
  module: {
     rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: {
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  performance: {
    hints: false
  }
};
