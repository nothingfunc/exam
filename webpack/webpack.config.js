/**
 * Created by zhengguo.chen on 2016/1/20.
 */
var PACKAGE = require('../package');
var path = require('path');
var glob = require( 'glob' );
var webpack = require('webpack');
const SRC_PATH = path.join(__dirname, '../browser');
const DIST_PATH = path.join(__dirname, '../public');
const COMPONENTS_PATH = path.join(__dirname, '../components');
const NODE_MODULES = path.join(__dirname, '../node_modules');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack_isomorphic_tools.config.js'))
                                        .development();

var IS_DEV = process.env.NODE_ENV !== 'production';

var componentStyles =

module.exports = {
  context: '',
  entry: {
    //js entry
    'boot': [
      path.join(NODE_MODULES, 'react-engine/lib/client')
    ],
    'index': path.join(SRC_PATH, 'index.js'),
    'exam': path.join(SRC_PATH, 'exam.js'),
    'users': path.join(SRC_PATH, 'users.js'),
    'canvas': path.join(SRC_PATH, 'canvas.js'),
    //common style
    'common': path.join(COMPONENTS_PATH, 'layouts/css/common.less'),
    // get all components style, without page-entry and layouts style.
    'components': glob.sync(path.join(COMPONENTS_PATH, '**/*.less')).reduce((pre, filePath) => {
      if(!/components\/(page|layouts)\//.test(filePath)) {
        pre.push(filePath);
      }
      return pre;
    }, [])
  },
  output: {
    path: path.join(DIST_PATH),
    publicPath: '/',
    filename: IS_DEV ? 'js/[name].js' : 'js/[name]_[chunkhash:6].js',
    chunkFilename: IS_DEV ? 'js/[name].js' : 'js/[name]_[chunkhash:6].js'
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /\.json$/, loader: 'json-loader'},
      {
        test: /\.less$/,
        exclude: /components(\\|\/)layouts/,
        loader: ExtractTextPlugin.extract('style',
        'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!' +
        'autoprefixer?browsers=last 4 version!' +
        'less?outputStyle=expanded&sourceMap=true&sourceMapContents=true')
      },
      {
        test: /\.less$/,
        include: /components(\\|\/)layouts/,
        loader: ExtractTextPlugin.extract('style',
        'css?sourceMap!' +
        'autoprefixer?browsers=last 4 version!' +
        'less?outputStyle=expanded&sourceMap=true&sourceMapContents=true')
      },
      {test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: `url-loader?limit=1024&name=img/[name]${IS_DEV ? '' : '_[hash:6]'}.[ext]`},
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: `url?limit=1000&mimetype=application/font-woff&name=font/[name]${IS_DEV ? '' : '_[hash:6]'}.[ext]`},
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: `url?limit=1000&mimetype=application/font-woff&name=font/[name]${IS_DEV ? '' : '_[hash:6]'}.[ext]`},
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: `url?limit=1000&mimetype=application/octet-stream&name=font/[name]${IS_DEV ? '' : '_[hash:6]'}.[ext]`},
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: `file?name=font/[name]${IS_DEV ? '' : '_[hash:6]'}.[ext]`},
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: `url?limit=1000&mimetype=image/svg+xml&name=font/[name]${IS_DEV ? '' : '_[hash:6]'}.[ext]`}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'boot',
      minChunks: Infinity
    }),
    new ExtractTextPlugin(IS_DEV ? 'css/[name].css' : 'css/[name]_[chunkhash:6].css', {allChunks: true}),
    webpackIsomorphicToolsPlugin
  ]
};