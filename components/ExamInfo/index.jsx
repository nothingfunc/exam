/**
 * Created by zhengguo.chen on 2016/3/24.
 */
var React = require('React');
var classnames = require('classnames');
var _ = require('lodash');
var style = require('./style.less');

const STATUS_DONE = 0;
const STATUS_START = 1;
const STATUS_CONTINUE = 2;

const getMinutes = (time) => {
  return Math.floor(time / 1000 / 60);
}

module.exports = React.createClass({
  getInitialState() {
    var {exam} = this.props;
    return {
      remainTime: this.props.remainTime,
      status: exam.isDone ? STATUS_DONE : (!exam.startTimestamp ? STATUS_START : STATUS_CONTINUE)
    }
  },
  componentDidMount() {
    console.log(this.props.exam);
  },
  render() {
    var {remainTime, status} = this.state;
    var {exam} = this.props;
    return <div className={style.wrapper}>
      <div className={style.info}>
        共{exam.count}题，满分{exam.totalScore}分，{exam.passScore}分通过
        <br/>
        答题时间：{getMinutes(exam.timeLimit)}分钟
        <div className={style.highlight}>
          {status === STATUS_START && <span>Ready Go?</span>}
          {status === STATUS_DONE && <span>得分：{exam.score}</span>}
          {status === STATUS_CONTINUE && <span>您已经开始答题<br/>请继续答题</span>}
        </div>
      </div>
      {
        exam.isDone && <div className={classnames(style.result, {[style.pass]: exam.isPass, [style.fail]: !exam.isPass})}>
          <span>{exam.isPass ? '通过' : '未通过'}</span>
        </div>
      }
      <a className={style.start} href={'/' + exam.examId + '/start'}>
        {status === STATUS_START && '开始答题'}
        {status === STATUS_CONTINUE && '继续答题'}
        {status === STATUS_DONE && '查看详情'}
      </a>
    </div>
  }
});