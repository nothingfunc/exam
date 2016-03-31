/**
 * Created by zhengguo.chen on 2016/3/24.
 */
var React = require('React');
var classnames = require('classnames');
var _ = require('lodash');
var style = require('./style.less');

var api = require('../../browser/lib/api');

module.exports = React.createClass({
  getInitialState() {
    return {
      questions: this.props.exam.questions
    }
  },
  onChoose(option, question, questionIndex) {
    this.setState((questions) => {
      var chosen = [];
      option.chosen = !option.chosen;
      question.options.map((opt, index) => {
        (!question.multiple && opt !== option) && (opt.chosen = false);
        opt.chosen && chosen.push(index);
      });
      api.choose(this.props.exam.examId, {
        questionIndex: questionIndex,
        questionId: question._id,
        chosen: chosen
      }).catch(err => {
        window.location.reload();
      });
      return questions;
    });
  },
  render() {
    var {questions} = this.state;
    var {isDone} = this.props.exam;
    return <div>
      <ul className={classnames(style.questionList, {[style.isDone]: isDone})}>
        {
          questions.map((question, questionIndex) => {
            var hasChosen = question.options.find((option) => option.chosen) !== undefined;
            return (
              <li key={question._id}
                  className={classnames({[style.chosen]: !isDone && hasChosen, [style.correct]: isDone && question.isCorrect, [style.wrong]: isDone && !question.isCorrect})}>
                <h3>
                  <span>{questionIndex + 1}. </span>
                  <span>{question.content}</span>
                  <span className={classnames(style.score, {
                      [style.s1]: question.score===3,
                      [style.s2]: question.score===6,
                      [style.s3]: question.score===8
                  })}>
                    {question.score}分
                  </span>
                </h3>
                <ol className={classnames(style.optionList, {[style.multiple]: question.multiple})}>
                  {
                    question.options.map((option, index) => {
                      return <li key={index}
                                 onClick={() => {
                                   !isDone &&
                                   this.onChoose(option, question, questionIndex)}
                                 }
                                 className={classnames({[style.selected]: option.chosen})}>
                        <i className={style.radio}></i>
                        <span className={classnames({[style.isAnswer]: option.answer})}>{option.content}</span>
                      </li>
                    })
                  }
                </ol>
              </li>
            );
          })
        }
      </ul>
      <p className={style.tips}>已经是最后一题啦~</p>
    </div>
  }
});