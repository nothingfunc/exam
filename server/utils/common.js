/**
 * Created by zhengguo.chen on 2016/3/23.
 */
var crypto = require('crypto');
var mongoose = require('mongoose');

var exports = {};

exports.md5 = (content, length) => {
  var md5Maker = crypto.createHash('md5');
  var length = length || 32;
  return md5Maker.update(content).digest('hex').substr(0, length);
};

exports.getExamId = (username, mobile, timestamp) => {
  return exports.md5([username, mobile, timestamp].join('|'), 16);
};

// mongoose 查询ID，如果ID格式不正确会报错，这里进行转化
exports.getObjectId = (id) => {
  if(id.length !== 24) {
    if(id.length < 24) {
      id = id + (new Array(25 - id.length).join('0'));
    } else {
      id = id.substr(0, 24);
    }
  }
  return id.replace(/[^0-9a-f]/g, '0');
};

// 检查是否是examId
exports.isExamId = (examId) => {
  return /^[a-f0-9]{16}$/.test(examId);
}

module.exports = exports;
