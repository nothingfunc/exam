var router = require('express').Router();
var questionModel = require('../../model/question');
var response = require('../../utils/response');
var lodash = require('lodash');

// 新增问题
router.post('/', (req, res, next) => {
  questionModel.createQuestion(req.body).then((content) => {
    response.success(res, content, 'Saved questions successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

// 删除问题
router.delete('/:id', (req, res, next) => {
  questionModel.removeQuestion({
    _id: req.params.id
  }).then((content) => {
    response.success(res, content, 'Deleted questions successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

// 获取问题
router.get('/:_id', (req, res, next) => {
  //response.success(res, req.params._id, 'Get questions successfully!');
  questionModel.getQuestion(req.params._id).then((content) => {
    response.success(res, content, 'Get questions successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

// 修改问题
router.put('/:id', (req, res, next) => {
  console.log(req.body);
  questionModel.updateQuestion(req.params.id, req.body).then((items) => {
    response.success(res, items, 'Updated question successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

// 获取问题列表
router.get('/list/:pageIndex/:pageSize', (req, res, next) => {
  req.params.pageIndex = (+req.params.pageIndex) || 1;
  req.params.pageSize = (+req.params.pageSize) || 20;
  questionModel.getQuestionList(req.params).then((items) => {
    response.success(res, items, 'Get questions successfully!');
  }).catch((err) => {
    response.error(res, err);
  });
});

module.exports = router;
