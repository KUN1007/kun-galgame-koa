const path = require('path')

const utils = require('./utils')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const webPackConfig = {
  target: 'node',
  entry: {
    server: path.join(utils.APP_PATH, 'index.ts'),
  },
  resolve: {
    ...utils.getWebpackResolveConfig(),
  },
  output: {
    filename: 'kun.js',
    path: utils.DIST_PATH,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
          },
          'ts-loader',
        ],
        exclude: [path.join(__dirname, '/node_modules')],
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
  ],
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
}

module.exports = webPackConfig
