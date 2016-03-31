/**
 * Created by zhengguo.chen on 2016/3/24.
 */
var React = require('react');
var DefaultLayout = require('./../layouts/default.jsx');
var QuestionList = require('../questionList/index.jsx');
var ExamControl = require('../examControl/index.jsx');
var ExamInfo = require('../ExamInfo/index.jsx');
var style = require('./css/exam.less');

var Exam = React.createClass({
  componentDidMount() {
    var {remainTime} = this.props;
    if(remainTime > 0) {
      setTimeout(() => {
        window.location.href = window.location.href;
      }, remainTime);
    }
  },
  render() {
    var {exam, view, remainTime} = this.props;
    return (
      <DefaultLayout
        {...this.props}
        css={['common', 'exam']}
        js={['boot', 'exam']}>
        <div className={style.container}>
          <h1 className={style.title}>
            {!view && <a className={style.back} href={'/' + exam.examId}></a>}
            {exam.title}
          </h1>
          {
            view && <div className={style.info}>
              <ExamInfo exam={exam}/>
            </div>
          }
          {
            !view && <div className={style.content}>
              <QuestionList exam={exam}/>
            </div>
          }
          {
            !view && <div className={style.footer}>
              <ExamControl exam={exam} remainTime={remainTime}/>
            </div>
          }
        </div>
      </DefaultLayout>
    );
  }
});

module.exports = Exam;