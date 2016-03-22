var express = require('express');
var router = express.Router();
var jsonModel = require('../model/json');
var examModel = require('../model/exam');
var response = require('../utils/response');
var lodash = require('lodash');

router.post('/question', function(req, res, next) {
  examModel.createQuestion(req.body).then((content) => {
    response.success(res, content, 'Saved questions successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

router.delete('/question/:id', function(req, res, next) {
  examModel.removeQuestion({
    _id: req.params.id
  }).then((content) => {
    response.success(res, content, 'Deleted questions successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

router.get('/question/:id', function(req, res, next) {
  examModel.getQuestion({
    _id: req.params.id
  }).then((content) => {
    response.success(res, content, 'Get questions successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

router.put('/question/:id', function(req, res, next) {
  console.log(req.body);
  examModel.updateQuestion(req.params.id, req.body).then((items) => {
    response.success(res, items, 'Updated question successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

router.get('/questions/:pageIndex/:pageSize', function(req, res, next) {
  req.params.pageIndex = (+req.params.pageIndex) || 1;
  req.params.pageSize = (+req.params.pageSize) || 20;
  examModel.getQuestionList(req.params).then((items) => {
    response.success(res, items, 'Get questions successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

router.post('/exam', function(req, res, next) {
  console.log(req.body);
  examModel.createExam(req.body).then((item) => {
    response.success(res, item, 'Create exam successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

router.get('/q/create', function(req, res, next) {
  jsonModel.createExam().then((item) => {
    res.json({
      code: 200,
      data: item,
      msg: 'Create exam successfully'
    });
  });
});

router.get('/q/get/:id', function(req, res, next) {
  jsonModel.getExam(req.params.id).then((item) => {
    res.json({
      code: 200,
      data: item,
      msg: 'Get successfully'
    });
  });
});

module.exports = router;
