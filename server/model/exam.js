/**
 * Created by zhengguo.chen on 2016/3/23.
 */
var mongoose = require('mongoose');
var _ = require('lodash');
var Q = require('q');
var common = require('../utils/common');
var questionModel = require('./question');
var configModel = require('./config');

var exports = {};

// question model (sub document)
var questionSchema = mongoose.Schema({
  content:   {type: String},
  isCorrect: {type: Boolean},
  score:     {type: Number},
  multiple:  {type: Boolean},
  options: [
    {
      content: {type: String},
      answer:  {type: Boolean, default: false},
      chosen:  {type: Boolean, default: false}
    }
  ]
});
// exam model
var examSchema = mongoose.Schema({
  username:        {type: String, default: ''},
  mobile:          {type: Number, default: 0},
  examId:          {type: String},
  title:           {type: String, default: ''},
  startTimestamp:  {type: Number, default: 0},
  submitTimestamp: {type: Number, default: 0},
  isDone:          {type: Boolean, default: false},
  correctCount:    {type: Number, default: 0},
  count:           {type: Number, default: 0},
  cost:            {type: Number, default: 0}, // seconds
  score:           {type: Number, default: 0},
  passScore:       {type: Number, default: 0},
  isPass:          {type: Boolean, default: false},
  questions:       [questionSchema]
});
var Exam = mongoose.model('exam', examSchema);

/**
 * 生成试题
 * @param item 包含用户名试题类型等信息
 * @returns {Promise|*}
 */
exports.createExam = (item) => {
  return configModel.getConfig().then((config) => {
    var jobs = _.map(config.EXAM_RULE, (rule) => {
      return questionModel.getRandomQuestionsByScore(item.examType, rule.score, rule.count)
    });
    return Q.all(jobs).then((questionGroup) => {
      var questions = _.flatten(questionGroup);
      item.examId = common.getExamId(item.username, item.mobile, Date.now());
      var exam = new Exam(_.pick(item, 'content', 'questions', 'examId'));
      exam.count = questions.length;
      exam.questions = questions;
      return exam.save();
    });
  });
};

/**
 * 获取试题
 * @param id _id
 * @returns {Promise|*}
 */
exports.getExam = (id) => {
  return Exam.findOne({_id : common.getObjectId(id)}).then((docs) => {
    return docs || null;
  });
};

/**
 * 通过examId获取试题
 * @param examId examId
 * @param withAnswer 是否包含答案
 * @param start 是否开始答题
 * @returns {Promise|*}
 */
exports.getExamByExamId = (examId, withAnswer, start) => {
  withAnswer = withAnswer || false;
  var conditions = {examId : examId};
  var update = {
    $set: {startTimestamp: Date.now()}
  };
  if(start) {

  } else {
    return Exam.findOne(conditions).then((docs) => {
      if(docs && docs.questions && !withAnswer) {
        docs.questions.map((question) => {
          question.answer = null;
        });
      }
      return docs || null;
    });
  }
};

/**
 * 更新试题
 * @param examId
 *
 */
exports.updateExam = (examId, updateObj) => {
  var conditions = {examId: examId};
  var update = {$set: updateObj};
  return Exam.update(conditions, update);
};

/**
 * 评分并保存
 * @param doc
 * @return {*}
 */
const calcScoreAndSave = (doc) => {
  var now = Date.now();
  var questions = doc.questions;
  doc.isDone = true;
  doc.correctCount = 0;
  doc.submitTimestamp = now;
  doc.cost = now - doc.startTimestamp;
  doc.score = questions.reduce((pre, cur) => {
    var score = cur.score;
    if(undefined === cur.options.find((option) => {
        return option.answer !== option.chosen;
    })) {
      doc.correctCount ++;
      pre += score;
      cur.isCorrect = true;
    }
    return pre;
  }, 0);
  return doc.save();
};

/**
 * 提交试题，这个方法需要定时调用
 * @param examId
 * @returns {Promise}
 */
exports.submitExam = (examId) => {
  return Exam.findOne({examId: examId, isDone:false}).then((doc) => {
    if(doc) {
      return calcScoreAndSave(doc);
    } else {
      return Q.reject('未找到试题，或试题已提交');
    }
  });
};

/**
 * 提交选择
 * @param examId
 * @returns {Promise}
 */
exports.updateQuestions = (examId, questionIndex, questionId, chosen) => {
  return Exam.findOne({examId: examId, isDone:false}).then((doc) => {
    if(!doc) {
      return Q.reject('选择答案失败，未找到试题');
    }
    var question = doc.questions[questionIndex];
    if(question && question._id == questionId) {
      _.map(question.options, (option, index) => {
        option.chosen = _.indexOf(chosen, index) !== -1
      });
      return doc.save().then(() => {
        return "Ok";
      });
    } else {
      return Q.reject('选择答案失败，试题中未找到该问题');
    }
  });
};

/**
 * 开始或继续答题
 * @param examId
 * @returns {Promise}
 */
exports.startExam = (examId) => {
  return configModel.getConfig().then((config) => {
    var timeLimit = config.EXAM_TIME_LIMIT;
    // 查找试题
    var conditions = {examId: examId};
    return Exam.findOne(conditions).then((doc) => {
      console.log('start exam');
      if(doc) {
        if(doc.isDone === true) {
          console.log('start exam, exam is done');
          return doc;
        } else {
          var now = Date.now();
          if(doc.startTimestamp === 0) {
            console.log('start exam, exam is start!');
            // 开始答题
            doc.startTimestamp = now;
            return doc.save();
          } else if(doc.startTimestamp + timeLimit <= now) {
            console.log('start exam, exam is timeout.');
            // 超时，提交试题
            return calcScoreAndSave(doc);
          } else {
            console.log('start exam, exam is continue...');
            return doc;
          }
        }
      }
      return null;
    });
  });
};

/**
 * 继续答题
 */
exports.continueExam = (examId) => {
  return configModel.getConfig().then((config) => {
    var timeLimit = config.EXAM_TIME_LIMIT;
    var now = Date.now();
    var conditions = {examId: examId, isDone: false};
    return Exam.findOne(conditions).then((doc) => {
      console.log(doc.startTimestamp, timeLimit, now, doc.startTimestamp + timeLimit > now);
      if(doc.startTimestamp + timeLimit > now) {
        if(doc && doc.questions) {
          doc.questions.map((question) => {
            question.answer = null;
          });
        }
        return doc || null;
      } else {
        return null;
      }
    });
  });
};

/**
 * 通过examId获取试题信息，不包含问题
 * @param examId examId
 * @param withAnswer 是否包含答案
 * @returns {Promise|*}
 */
exports.getExamInfoByExamId = (examId) => {
  var fields = {questions: 0}
  return Exam.find({examId : examId}, fields).then((docs) => {
    return docs[0] || null;
  });
};

/**
 * 删除试题
 * @param id 试题ID
 * @returns {Promise|*}
 */
exports.removeExam = (id) => {
  return Exam.remove({_id : common.getObjectId(id)});
};

/**
 * 获取试题列表，包含查询和分页
 * @returns {Promise|*}
 */
exports.getExamList = (query) => {
  var conditions = {};
  var fields = {questions:0};
  return Q.all([
    Exam.count(),
    Exam.find(conditions, fields)
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
