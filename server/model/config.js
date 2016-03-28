/**
 * Created by zhengguo.chen on 2016/3/23.
 */
var exports = {};
var Q = require('q');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

const CONFIG_PATH = path.join(__dirname, '../../server.json');
const WRITABLE_KEY = ['EXAM_RULE', 'DB_NAME', 'PASS_RULE', "EXAM_TIME_LIMIT"];

var __configCache = null;

/**
 * 获取配置
 * @returns {Promise|*}
 */
exports.getConfig = () => {
  if(__configCache === null) {
    return Q.nfcall(fs.readFile, CONFIG_PATH, 'utf-8').then((content) => {
      __configCache = JSON.parse(content);
      return __configCache;
    })
  } else {
    return Q.resolve(__configCache);
  }
};

/**
 * 修改配置
 * @param config 配置信息
 * @returns {Promise|*}
 */
exports.saveConfig = (config) => {
  var content = JSON.stringify(_.merge({}, __configCache, _.pick(config, WRITABLE_KEY)), null, "  ");
  return Q.nfcall(fs.writeFile, CONFIG_PATH, content, 'utf-8').then(() => {
    // 修改完成后删除缓存
    __configCache = null;
    return exports.getConfig();
  });
};

module.exports = exports;
