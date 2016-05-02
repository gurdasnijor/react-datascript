var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/examples/index.html',
  filename: 'index.html',
  inject: 'body'
});

var config = {
  devtool: 'eval',

  entry: [
    path.resolve(__dirname, 'examples/index.js')
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    outputPath: path.join(__dirname, 'dist')
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules(?!\/(edn-js)))/,
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=15000'
      }
    ]
  },

  plugins: [
    HtmlWebpackPluginConfig,
    new ExtractTextPlugin('styles/style.css')
  ]
};

module.exports = config;
