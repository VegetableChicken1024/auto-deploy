const { resolve } = require("path");
// const WebpackObfuscator = require('webpack-obfuscator');
const nodeExternals = require("webpack-node-externals");
const shebangPlugin = require("webpack-shebang-plugin");

module.exports = {
  entry: "./index.ts",
  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "dist"),
    library: {
      name: "auto-deploy",
      type: "umd",
      export: "default",
    },
  },
  target: "node",
  mode: "production",
  externals: [
    nodeExternals({}), // 这个插件用来帮助打包时排除`node_modules`中的依赖
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.node$/,
        use: "node-loader",
      },
    ],
  },
  plugins: [
    // new WebpackObfuscator({
    //   rotateStringArray: true,
    //   stringArray: true,
    //   stringArrayEncoding: ['base64'],
    //   stringArrayThreshold: 0.75,
    // }),
    new shebangPlugin(),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
