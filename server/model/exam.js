/**
 * Created by zhengguo.chen on 2016/3/21.
 */
var mongoose = require('mongoose');
var lodash = require('lodash');
var Q = require('q');

var exports = {};

//db connect
const connectToDb = () => {
  console.log('Try to connect to db');
  mongoose.connect('mongodb://127.0.0.1/exam');
};
mongoose.connection.on('error', (err) => {
  setTimeout(connectToDb, 3000);
}).on('open', () => {
  console.log('Connect to db successfully!');
});
connectToDb();


// questions
var questionSchema = mongoose.Schema({
  content:         {type: String},
  score:           {type: Number, default: 2}, // 2 6 5 8
  select:          {type: Number, default: 0},
  correct:         {type: Number, default: 0},
  wrong:           {type: Number, default: 0},
  createTimestamp: {type: Number},
  updateTimestamp: {type: Number},
  random:          {type: Number},  // for random query
  options: [
    {type: String}
  ],
  answer: [
    {type: Number}
  ]
});

var Question = mongoose.model('question', questionSchema);

// 添加问题
exports.createQuestion = (item) => {
  item.createTimestamp = Date.now();
  item.random = Math.random();
  return new Question(lodash.pick(item, 'content', 'options', 'answer', 'score', 'createTimestamp', 'random')).save();
};

// 删除问题
exports.removeQuestion = (id) => {
  var conditions = {_id : id};
  return Question.remove(conditions).then((docs) => {
    return docs;
  });
};

// 获取单个问题
exports.getQuestion = (query) => {
  return Question.find(query);
};

// 修改问题
exports.updateQuestion = (id, item) => {
  item.updateTimestamp = Date.now();
  var conditions = {_id : id};
  var update     = {$set : lodash.pick(item, 'content', 'options', 'answer', 'score', 'updateTimestamp')};
  var options    = {upsert : false};
  return Question.update(conditions, update, options).then((docs) => {
    return docs;
  });
};

// 获取问题列表，包含分页和查询
exports.getQuestionList = (query) => {
  return Q.all([
    Question.count(),
    Question.find()
      .skip((query.pageIndex - 1) * query.pageSize)
      .limit(query.pageSize)
      .exec()
  ]).then((docs) => {
    return {
      count: docs[0],
      content: docs[1]
    }
  });
};


// exams
var examSchema = mongoose.Schema({
  title:           {type: String},
  createTimestamp: {type: Number},
  startTimestamp:  {type: Number},
  submitTimestamp: {type: Number},
  isDone:          {type: Boolean},
  cost:            {type: Number}, // seconds
  score:           {type: Number, default: 0},
  passScore:       {type: Number, default: 0},
  isPass:          {type: Boolean},
  questions: [
    {
      content:   {type: String},
      isCorrect: {type: Boolean},
      score:     {type: Number},
      options: [,
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

const getRandomQuestionsByScore = (score, limit) => {
  // todo optimize random, these questions should be shuffle at sometimes
  var rand = Math.random();
  var conditions = {score: score, random: {$gt: rand}};
  var fields     = {content: 1, options: 1, answer: 1, score: 1};
  return Question.find(conditions, fields).limit(limit).then((items) => {
    var questions = items;
    if(items.length < limit) {
      limit = limit - items.length;
      conditions = {score: score, random: {$lt: rand}};
      return Question.find(conditions, fields).limit(limit).then((items) => {
        questions.concat(items);
        return questions;
      });
    } else {
      return questions;
    }
  });
};

// 创建试题
exports.createExam = () => {
  return Q.all([
    getRandomQuestionsByScore(3, 10),
    getRandomQuestionsByScore(6, 5),
    getRandomQuestionsByScore(8, 5)
  ]);
};

module.exports = exports;
