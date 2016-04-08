/**
 * Created by zhengguo.chen on 2016/3/21.
 */
var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');
var common = require('../utils/common');
var configModel = require('./config');

var exports = {};

// questions model
var questionSchema = mongoose.Schema({
  content:         {type: String},
  score:           {type: Number, default: 2}, // 2 6 5 8
  select:          {type: Number, default: 0},
  correct:         {type: Number, default: 0},
  wrong:           {type: Number, default: 0},
  updateTimestamp: {type: Number},
  examType:        {type: Number, default: 0},
  random:          {type: Number},  // for random query
  multiple:        {type: Boolean, default: false},
  options: [
    {
      content: {type: String},
      answer:  {type: Boolean}
    }
  ]
});
var Question = mongoose.model('question', questionSchema);

/**
 * 添加问题
 * @param id 问题ID
 * @returns {Promise|*}
 */
exports.createQuestion = (item) => {
  item.random = Math.random();
  return new Question(_.pick(item, 'content', 'options', 'answer', 'score', 'random', 'examType', 'multiple')).save();
};

/**
 * 删除问题
 * @param id 问题ID
 * @returns {Promise|*}
 */
exports.removeQuestion = (id) => {
  return Question.remove({_id : common.getObjectId(id)});
};

/**
 * 获取单个问题
 * @param id 问题ID
 * @returns {Promise|*}
 */
exports.getQuestion = (id) => {
  return Question.findOne({_id : common.getObjectId(id)}).then((docs) => {
    return docs || null;
  });
};

/**
 * 修改问题
 * @param id 问题ID
 * @param item
 * @returns {Promise|*}
 */
exports.updateQuestion = (id, item) => {
  item.updateTimestamp = Date.now();
  var conditions = {_id : common.getObjectId(id)};
  var update     = {$set : _.pick(item, 'content', 'options', 'answer', 'score', 'updateTimestamp')};
  var options    = {upsert : false};
  return Question.update(conditions, update, options);
};

/**
 * 根据类型分数随机获取一些问题
 * @param examType 试题类型
 * @param score 问题分数
 * @param limit 获取数量
 * @returns {Promise|*}
 */
exports.getRandomQuestionsByScore = (examType, score, limit) => {
  // todo optimize random, these questions should be shuffled at sometimes
  // refer: http://www.tuicool.com/articles/77N3Yri
  var rand = Math.random();
  return configModel.getConfig().then((config) => {
    var commonType = config.EXAM_TYPE.common;
    var conditions = {examType: {$in: [examType, commonType]}, score: score, random: {$gt: rand}};
    var fields = {content: 1, options: 1, score: 1, multiple: 1, examType: 1};
    return Question.find(conditions, fields).limit(limit).then((items) => {
      var questions = items;
      // 如果查询数不够，再反方向查询
      if (items.length < limit) {
        limit = limit - items.length;
        conditions = {examType: {$in: [examType, commonType]}, score: score, random: {$lt: rand}};
        return Question.find(conditions, fields).limit(limit).then((items) => {
          questions = questions.concat(items);
          return questions;
        });
      } else {
        return questions;
      }
    });
  });
};

/**
 * 获取问题列表，包含分页和查询
 * @param query
 * @returns {Promise|*}
 */
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
