/**
 * Created by zhengguo.chen on 2016/3/24.
 */
var React = require('react');
var DefaultLayout = require('./../layouts/default.jsx');
var QuestionList = require('../questionList/index.jsx');
var ExamControl = require('../examControl/index.jsx');
var style = require('./css/exam.less');

var Exam = React.createClass({
  componentDidMount() {
  },
  render() {
    var {exam, remainTime} = this.props;
    return (
      <DefaultLayout
        {...this.props}
        css={['common', 'exam']}
        js={['boot', 'exam']}>
        <div className={style.content}>
          <QuestionList exam={exam}/>
        </div>
        <div className={style.footer}>
          <ExamControl exam={exam} remainTime={remainTime}/>
        </div>
      </DefaultLayout>
    );
  }
});

module.exports = Exam;