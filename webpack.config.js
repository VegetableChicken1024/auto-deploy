const { resolve } = require('path');
// const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
  },
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.node$/,
        use: 'node-loader',
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
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],

  },
};
