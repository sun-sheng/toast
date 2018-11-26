const webpack = require('webpack')

module.exports = {
  //...
  entry: {
    main: './src/index.js'
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
    filename: 'dist/toast.min.js',
    auxiliaryComment: 'web notification'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ],
  externals: {}
}