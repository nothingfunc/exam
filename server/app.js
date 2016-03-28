var PACKAGE = require('../package.json');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var ReactEngine = require('react-engine');
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

// routers
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/canvas', require('./routes/canvas'));
app.use('/api/config', require('./routes/api/config'));
app.use('/api/Exam', require('./routes/api/exam'));
app.use('/api/question', require('./routes/api/question'));

if(!process.env.API) {
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  app.use((err, req, res, next) => {
    var errorCode = err.status || 500;
    res.status(errorCode).render('error', {
      code: errorCode,
      message: err.message,
      // if not development, no stacktraces leaked to user
      error: IS_DEV ? JSON.stringify(err.stack) : ''
    });
  });
} else {
  // error handlers
  app.use((err, req, res, next) => {
    console.log(err.stack);
    var errorCode = err.status || 500;
    res.status(errorCode).send(err.stack);
  });
}

module.exports = app;
