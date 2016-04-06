/**
 * Created by zhengguo.chen on 2016/3/22.
 */
var exports = {};

exports.success = (res, data, msg) => {
  res.json({
    code: 200,
    data: data,
    msg:  msg || 'Successful!'
  });
};

exports.error = (res, err, msg) => {
  if(typeof err == 'string') {
    msg = err || msg;
    err = {
      status: 500,
      stack: ''
    }
  }
  res.json({
    code: err.status || 500,
    data: err.stack,
    msg:  msg || 'Server occurs an error!'
  });
};

module.exports = exports;