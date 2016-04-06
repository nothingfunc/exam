/**
 * Created by zhengguo.chen on 2016/4/6.
 */

// 处理登录和注销
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var response = require('../../utils/response');
var configModel = require('../../model/config');

// 登录
router.post('/', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  configModel.getConfig().then((config) => {
    var ADMIN_USERNAME = config.ADMIN_USERNAME;
    var ADMIN_PASSWORD = config.ADMIN_PASSWORD;
    var AUTH_TOKEN_COOKIE = config.AUTH_TOKEN_COOKIE;
    var AUTH_SECRET = config.AUTH_SECRET;
    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      var data = {username: ADMIN_USERNAME};
      jwt.sign(data, AUTH_SECRET, {expiresIn: 60*30}, (token) => {
        res.cookie(AUTH_TOKEN_COOKIE, token, {httpOnly: true});
        response.success(res, token);
      });
    } else {
      response.error(res, 'Username or password is error');
    }
  }).catch(console.log);
});

// 登录test
router.get('/', (req, res, next) => {
  configModel.getConfig().then((config) => {
    var ADMIN_USERNAME = config.ADMIN_USERNAME;
    var AUTH_TOKEN_COOKIE = config.AUTH_TOKEN_COOKIE;
    var AUTH_SECRET = config.AUTH_SECRET;
    var data = {username: ADMIN_USERNAME};
    jwt.sign(data, AUTH_SECRET, {expiresIn: 60 * 30}, (token) => {
      res.cookie(AUTH_TOKEN_COOKIE, token, {httpOnly: true});
      response.success(res, token);
    });
  });
});

// 注销
router.delete('/', (req, res, next) => {
  res.cookie('xxx', 'yyy');
  res.send('xx');
});

module.exports = router;