const { merge } = require('webpack-merge')

const baseWebpackConfig = require('./webpack.config.base')
const NodemonPlugin = require('nodemon-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  stats: { children: false },
  plugins: [new NodemonPlugin()],
})

module.exports = webpackConfig
