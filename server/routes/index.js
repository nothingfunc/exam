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
  if(!common.isExamId(examId)) {
    next();
    return;
  }
  var ret = (exam) => {
    var remainTime = exam.timeLimit - (Date.now() - exam.startTimestamp);
    exam.questions = null;
    res.render('exam', {
      ASSETS: global.ISOMORPHIC_ASSETS,
      view: true,
      remainTime: remainTime || 0,
      title: exam.title,
      exam: exam
    });
  }
  examModel.getExamByExamId(examId).then((exam) => {
    var remainTime = exam.timeLimit - (Date.now() - exam.startTimestamp);
    if(remainTime <= 0 && !exam.isDone && exam.startTimestamp) {
      examModel.calcScoreAndSave(exam).then((exam) => {
        console.log('Force submit', exam);
        ret(exam);
      })
    } else {
      ret(exam);
    }
  });
});

// 开始答题或继续答题
router.get('/:examId/start', function(req, res, next) {
  var examId = req.params.examId;
  if(!common.isExamId(examId)) {
    next();
    return;
  }
  examModel.startExam(examId).then((exam) => {
    var remainTime = exam.timeLimit - (Date.now() - exam.startTimestamp);
    res.render('exam', {
      ASSETS: global.ISOMORPHIC_ASSETS,
      remainTime: remainTime,
      title: exam.title,
      exam: exam
    });
  }).catch(err => console.log(err));
  /* 现在每套题有答题时间的配置了，不再从config里取了
  Q.all([
    configModel.getConfig(),
    examModel.startExam(examId)
  ]).then((data) => {
    var remainTime = data[0].EXAM_TIME_LIMIT - (Date.now() - data[1].startTimestamp);
    var exam = data[1];
    res.render('exam', {
      ASSETS: global.ISOMORPHIC_ASSETS,
      title: exam.title,
      remainTime: remainTime,
      exam: exam
    });
  }).catch(err => console.log(err));
  */
});


module.exports = router;
