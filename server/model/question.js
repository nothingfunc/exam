/**
 * Created by zhengguo.chen on 2016/3/21.
 */
var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');
var CONFIG = require('../config.json');
var common = require('../utils/common');
require('./base');

var exports = {};

// questions
var questionSchema = mongoose.Schema({
  content:         {type: String},
  score:           {type: Number, default: 2}, // 2 6 5 8
  select:          {type: Number, default: 0},
  correct:         {type: Number, default: 0},
  wrong:           {type: Number, default: 0},
  updateTimestamp: {type: Number},
  examType:        {type: Number, default: 0},
  random:          {type: Number},  // for random query
  options: [
    {type: String}
  ],
  answer: [
    {type: Number}
  ]
});
var Question = mongoose.model('question', questionSchema);

exports.model = Question;

// 添加问题
exports.createQuestion = (item) => {
  item.random = Math.random();
  return new Question(_.pick(item, 'content', 'options', 'answer', 'score', 'random', 'examType')).save();
};

// 删除问题
exports.removeQuestion = (id) => {
  return Question.remove({_id : id});
};

// 获取单个问题
exports.getQuestion = (id) => {
  return Question.find({_id : id});
};

// 修改问题
exports.updateQuestion = (id, item) => {
  item.updateTimestamp = Date.now();
  var conditions = {_id : id};
  var update     = {$set : _.pick(item, 'content', 'options', 'answer', 'score', 'updateTimestamp')};
  var options    = {upsert : false};
  return Question.update(conditions, update, options);
};

// 获取问题列表，包含分页和查询
exports.getQuestionList = (query) => {
  return Q.all([
    Question.count(),
    Question.find()
      .skip((query.pageIndex - 1) * query.pageSize)
      .limit(query.pageSize)
      .exec()
  ]).then((results) => {
    return {
      count: results[0],
      content: results[1]
    }
  });
};

module.exports = exports;
