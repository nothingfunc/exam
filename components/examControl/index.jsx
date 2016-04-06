/**
 * Created by zhengguo.chen on 2016/3/24.
 */
var React = require('React');
var classnames = require('classnames');
var _ = require('lodash');
var style = require('./style.less');

var Dialog = require('../dialog/index.jsx');

var api = require('../../browser/lib/api');


const getFormatTime = (time) => {
  var h = Math.floor(time / 1000 / 60 / 60);
  var m = Math.floor(time / 1000 / 60) % 60;
  var s = Math.floor(time / 1000) % 60;
  return (h ? (h + "小时"): "") +
    (m ? (m + "分"): "") +
    (s ? (s + "秒"): "");
};

const getDoneStatus = (questions) => {
  var doneCnt = questions.reduce((pre, question) => {
    if(question.options.find((option) => option.chosen) !== undefined) {
      pre++;
    }
    return pre;
  }, 0);
  return [doneCnt, questions.length];
};

module.exports = React.createClass({
  getInitialState() {
    return {
      remainTime: this.props.remainTime
    }
  },
  onSubmitConfirm() {
    var doneStatus = getDoneStatus(this.props.exam.questions);
    this.setState({
      confirmShow: true,
      confirmMsg: '您完成了' + doneStatus[0] + '/' + doneStatus[1] + '，确认要提交试题？'
    })
  },
  onCancel() {
    this.setState({
      confirmShow: false
    })
  },
  onOk() {
    this.setState({
      confirmShow: false
    });
    api.submitExam(this.props.exam.examId, {}).then(() => {
      window.location.href = '/' + this.props.exam.examId;
    });
  },
  componentDidMount() {
    var interval = 0;
    if(!this.props.exam.isDone) {
      interval = setInterval(() => {
        this.setState((state) => {
          state.remainTime -= 1000;
          if(state.remainTime <= 1000) {
            clearInterval(interval);
            this.onOk();
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
    var {remainTime, confirmMsg, confirmShow} = this.state;
    var {exam} = this.props;
    var doneStatus = getDoneStatus(this.props.exam.questions);
    return <div className={style.control}>
      {
        exam.isDone ? (
          <span>
            <span className={classnames(style.unit, style.score)}>{exam.score}</span>
            <span className={classnames(style.unit, style.sup)}>分</span>
            <span className={classnames(style.unit, {[style.pass]: exam.isPass, [style.fail]: !exam.isPass})}>{exam.isPass ? '通过' : '未通过'}</span>
            <span className={style.unit}>正确：{exam.correctCount}/{exam.count}</span>
            <span className={style.unit}>用时：{getFormatTime(exam.cost)}</span>
          </span>
        ) : (
          <span>
            <span className={style.unit}>剩余时间：<strong>{getFormatTime(remainTime) || '0秒'}</strong></span>
            <span className={style.unit}>已完成：<strong>{doneStatus[0]}/{doneStatus[1]}</strong></span>

            <button className={style.submit} onClick={this.onSubmitConfirm}>我答好了</button>
            <Dialog title="确认提交" msg={confirmMsg} hidden={!confirmShow}
                    onOk={this.onOk} onCancel={this.onCancel}/>
          </span>
        )
      }
    </div>
  }
});