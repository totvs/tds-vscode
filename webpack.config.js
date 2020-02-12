const path = require("path");

module.exports = {
  target: 'node',
  entry: {
    index: "./src/debug/tdsreplay/app/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "./out/debug/tdsreplay"),
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
