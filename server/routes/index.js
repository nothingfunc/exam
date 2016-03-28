var router = require('express').Router();
var examModel = require('../model/exam');
var configModel = require('../model/config');
var common = require('../utils/common');
var Q = require('q');

/* GET home page. */
router.get('/', function(req, res, next) {
  var a = 'Express xx xxx';
  res.render('index', {
    ASSETS: global.ISOMORPHIC_ASSETS,
    title: a,
    name: 'Mill'+'et',
    list: ['hi', 'yes', 'bad']
  });
});

// 答题信息页面
router.get('/:examId', function(req, res, next) {
  var examId = req.params.examId;
  if(common.isExamId(examId)) {
    examModel.getExamInfoByExamId(examId).then((content) => {
      res.send(JSON.stringify(content));
    });
  } else {
    next();
  }
});

// 开始答题
router.get('/:examId/:command', function(req, res, next) {
  var examId = req.params.examId;
  var command = req.params.command;
  if(common.isExamId(examId)) {
    switch (command) {
      // 开始答题或继续答题
      case 'start':
        Q.all([
          configModel.getConfig(),
          examModel.startExam(examId)
        ]).then((data) => {
          var remainTime = data[0].EXAM_TIME_LIMIT - (Date.now() - data[1].startTimestamp);
          res.render('exam', {
            ASSETS: global.ISOMORPHIC_ASSETS,
            title: 'XX的试题',
            remainTime: remainTime,
            exam: data[1]
          });
        }).catch(err => console.log(err));
        break;
      default :
        next();
    }
  } else {
    next();
  }
});


module.exports = router;
