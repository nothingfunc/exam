/**
 * Created by zhengguo.chen on 2016/3/23.
 */
var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');
var CONFIG = require('../config.json');
var common = require('../utils/common');
var Question = require('./question').model;
require('./base');

var exports = {};

// exams
var examSchema = mongoose.Schema({
  username:        {type: String, default: ''},
  mobile:          {type: Number, default: 0},
  examId:          {type: String},
  title:           {type: String, default: ''},
  startTimestamp:  {type: Number, default: 0},
  submitTimestamp: {type: Number, default: 0},
  isDone:          {type: Boolean, default: false},
  cost:            {type: Number, default: 0}, // seconds
  score:           {type: Number, default: 0},
  passScore:       {type: Number, default: 0},
  isPass:          {type: Boolean, default: false},
  questions: [
    {
      content:   {type: String},
      isCorrect: {type: Boolean},
      score:     {type: Number},
      options: [
        {type: String}
      ],
      answer:   [
        {type: Number}
      ],
      chosen:   [
        {type: Number}
      ]
    }
  ]
});
var Exam = mongoose.model('exam', examSchema);

// 获取questions
const getRandomQuestionsByScore = (examType, score, limit) => {
  // todo optimize random, these questions should be shuffled at sometimes
  var rand = Math.random();
  var conditions = {examType:{$in: [examType, CONFIG.EXAM_TYPE.common]}, score: score, random: {$gt: rand}};
  var fields = {content: 1, options: 1, answer: 1, score: 1};
  return Question.find(conditions, fields).limit(limit).then((items) => {
    var questions = items;
    if(items.length < limit) {
      limit = limit - items.length;
      conditions = {examType:{$in: [examType, CONFIG.EXAM_TYPE.common]}, score: score, random: {$lt: rand}};
      return Question.find(conditions, fields).limit(limit).then((items) => {
        questions = questions.concat(items);
        return questions;
      });
    } else {
      return questions;
    }
  });
};

// 生成试题
exports.createExam = (item) => {
  var jobs = CONFIG.EXAM_RULE.map((rule) => {
    return getRandomQuestionsByScore(item.examType, rule.score, rule.count)
  });
  return Q.all(jobs).then((questionGroup) => {
    var questions = _.flatten(questionGroup);
    item.questions = questions;
    item.examId = common.getExamId(item.username, item.mobile, Date.now());
    return new Exam(_.pick(item, 'content', 'questions', 'examId')).save();
  });
};

module.exports = exports;
