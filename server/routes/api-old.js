var express = require('express');
var router = express.Router();
var jsonModel = require('../model/json');
var examModel = require('../model/exam');

router.get('/q/:content/:options/:answer', function(req, res, next) {
  examModel.addQuestion({
    content: req.params.content,
    option: ['Yes', 'No'],
    answer: [1]
  }).then((content) => {
    console.log(content);
    res.json({
      code: 200,
      data: content,
      msg: 'Saved!'
    });
  });


  //jsonModel.addQuestion().then(() => {
  //  res.json({
  //    code: 200,
  //    data: 'ok',
  //    msg: 'Saved!'
  //  });
  //});


});

router.get('/q', function(req, res, next) {
  jsonModel.getQuestions().then((data) => {
    res.json({
      code: 200,
      data: data,
      msg: 'Saved successfully232'
    });
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
