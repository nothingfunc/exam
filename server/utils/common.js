/**
 * Created by zhengguo.chen on 2016/3/23.
 */
var crypto = require('crypto');

var exports = {};

exports.md5 = (content) => {
  var md5Maker = crypto.createHash('md5');
  return md5Maker.update(content).digest('hex');
};

exports.getExamId = (username, mobile, timestamp) => {
  return exports.md5([username, mobile, timestamp].join('|'));
};

module.exports = exports;
