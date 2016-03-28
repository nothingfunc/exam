/**
 * Created by zhengguo.chen on 2016/3/24.
 */
var React = require('React');
var classnames = require('classnames');
var _ = require('lodash');
var style = require('./style.less');

var api = require('../../browser/lib/api');


const getFormatTime = (time) => {
  var h = Math.floor(time / 1000 / 60 / 60);
  var m = Math.floor(time / 1000 / 60) % 60;
  var s = Math.floor(time / 1000) % 60;
  return (h ? (h + "小时"): "") +
    (m ? (m + "分"): "") +
    (s ? (s + "秒"): "");
};

module.exports = React.createClass({
  getInitialState() {
    return {
      remainTime: this.props.remainTime
    }
  },
  onSubmit() {
    if(window.confirm('确认提交？')) {
      api.submitExam(this.props.exam.examId, {}).then(() => {
        window.location.href = window.location.href;
      });
    }
  },
  componentDidMount() {
    if(!this.props.exam.isDone) {
      setInterval(() => {
        this.setState((state) => {
          state.remainTime -= 1000;
          if(state.remainTime <= 0) {
            console.log('submit!!');
          }
          return state;
        });
      }, 1000);
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
      api.choose(this.props.examId, {
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
    var {remainTime} = this.state;
    var {exam} = this.props;
    var accuracy = parseInt((exam.correctCount / exam.count) * 100);
    return <div>
      {
        exam.isDone ? (
          <div>
            <span>分数：<span>{exam.score}</span></span>
            <span>正确率：{accuracy}% ({exam.correctCount}/{exam.count})</span>
            <span>用时：<span>{getFormatTime(exam.cost)}</span></span>
          </div>
        ) : (
          <div>
            <span>剩余时间：{getFormatTime(remainTime)}</span>
            <button onClick={this.onSubmit}>提交</button>
          </div>
        )
      }
    </div>
  }
});