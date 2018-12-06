const webpack = require('webpack')
const path = require('path')

module.exports = {
  // watch: true,
  //...
  entry: {
    main: './src/toast.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  output: {
    library: '$toast',
    libraryExport: 'default',
    libraryTarget: 'umd',
    filename: 'toast.min.js',
    auxiliaryComment: 'web notification'
  },
  plugins: [],
  externals: {},
  optimization: {
    minimize: process.env.MODE === 'dev' ? false : true
  }
}