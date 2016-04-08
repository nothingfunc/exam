var router = require('express').Router();
var lodash = require('lodash');
var examModel = require('../../model/exam');
var response = require('../../utils/response');
var common = require('../../utils/common');

// 创建一套试题
router.post('/', (req, res, next) => {
  req.body.examType = (+req.params.examType) || 0;
  examModel.createExam(req.body).then((item) => {
    response.success(res, item, 'Create exam successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

// 获取一套试题，id是object id
router.get('/:id', (req, res, next) => {
  examModel.getExam(req.params.id).then((item) => {
    response.success(res, item, 'Get exam successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

// 删除一套试题，id是object id
router.delete('/:id', (req, res, next) => {
  examModel.removeExam(req.params.id).then((item) => {
    response.success(res, item, 'Delete exam successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

// 获取试题列表
router.get('/list/:pageIndex/:pageSize', (req, res, next) => {
  req.params.pageIndex = (+req.params.pageIndex) || 1;
  req.params.pageSize = (+req.params.pageSize) || 20;
  examModel.getExamList(req.params).then((items) => {
    response.success(res, items, 'Get questions successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

// 答题开始，更新选项
router.put('/:examId/choose', (req, res, next) => {
  var questionIndex = req.body.questionIndex || 0;
  var questionId = req.body.questionId;
  var chosen = req.body.chosen;
  examModel.updateQuestions(req.params.examId, questionIndex, questionId, chosen).then((doc) => {
    response.success(res, doc, 'Update chosen successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

// 答题结束，提交
router.post('/:examId/submit', (req, res, next) => {
  console.log('submit');
  examModel.submitExam(req.params.examId).then((doc) => {
    response.success(res, doc, 'Submit exam successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

module.exports = router;
