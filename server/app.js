var PACKAGE = require('../package.json');
var express = require('express');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var ReactEngine = require('react-engine');
var configModel = require('./model/config');
var response = require('./utils/response');
var _ = require('lodash');

require('./model/exam');

var app = express();

// view engine setup
var engine = ReactEngine.server.create({
  /*
   see the complete server options spec here:
   https://github.com/paypal/react-engine#server-options-spec
   */
});
app.engine('.jsx', engine);
app.set('views', path.join(__dirname, '../components/page'));
app.set('view engine', 'jsx');

// finally, set the custom view
app.set('view', require('react-engine/lib/expressView'));

// enable gzip
app.use(compression({filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false;
    }
    // fallback to standard filter function
    return compression.filter(req, res);
  }
}));

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// when development, refresh isomorphic in every request
if(global.IS_DEV) {
  app.use((req, res, next) => {
    //console.log('isomorphic refreshed');
    global.webpackIsomorphicTools.refresh();
    global.ISOMORPHIC_ASSETS = _.pick(global.webpackIsomorphicTools.assets(), 'styles', 'javascript');
    next();
  });
} else {
  global.ISOMORPHIC_ASSETS = _.pick(require('../webpack-assets'), 'styles', 'javascript');
}

// static path
app.use(express.static(path.join(__dirname, '../public')));

// 连接数据库
require('./utils/connectDb');

// setup auth
configModel.getConfig().then((config) => {
  var AUTH_TOKEN_COOKIE = config.AUTH_TOKEN_COOKIE;
  var AUTH_SECRET = config.AUTH_SECRET;
  app.use(expressJwt({
    secret: AUTH_SECRET,
    getToken(req) {
      if(req.headers.authorization) {
        return req.headers.authorization;
      } else if (req.query && req.query.token) {
        console.log('query auth', req.query.token)
        return req.query.token;
      } else {
        console.log('cookie auth')
        return req.cookies[AUTH_TOKEN_COOKIE];
      }
      return null;
    }
  }).unless({path: [
    '/api/token',
    /^\/?$/,
    /^\/[a-f0-9]{16}$/,
    /^\/[a-f0-9]{16}\/start$/,
    /^\/[a-f0-9]{16}\/submit$/,
    /^\/api\/exam\/[a-f0-9]{16}\/choose$/,
    /^\/api\/exam\/[a-f0-9]{16}\/submit$/
  ]}));
}).then(() => {

  // routes
  app.get('/protected',
    function(req, res) {
      res.send(req.user);
    }
  );

  // routers
  app.use('/', require('./routes/index'));
  app.use('/users', require('./routes/users'));
  app.use('/canvas', require('./routes/canvas'));
  app.use('/api/token', require('./routes/api/token')); // 登录和注销
  app.use('/api/config', require('./routes/api/config'));
  app.use('/api/exam', require('./routes/api/exam'));
  app.use('/api/question', require('./routes/api/question'));

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    var err = new Error('Page Not Found **');
    err.status = 404;
    next(err);
  });

  // auth error
  app.use(function (err, req, res, next) {
    var status = err.status || 500;
    if(req.originalUrl.indexOf('/api') === 0) {
      response.error(res, IS_DEV ? err : '');
    } else {
      res.status(status).render('error', {
        code: status,
        message: err.msg,
        error: IS_DEV ? err.stack : ''
      });
    }
  });
});

module.exports = app;
