/**
 * Created by zhengguo.chen on 2016/2/1.
 */
var React = require('react');
var classnames = require('classnames');
var _ = require('lodash');

var DefaultLayout = require('./../layouts/default.jsx');
var api = require('./../../browser/lib/api');

var style = require('./css/index.less');


var Index = React.createClass({
  getInitialState() {
    var TYPES = [
      {value:'id', label: '考号'},
      {value:'info', label: '信息'}
    ];
    return {
      types: TYPES,
      selectedType: TYPES[0],
      selectOpen: false,
      examId: ''
    }
  },
  onSelect(type, index) {
    this.setState((state) => {
      state.selectOpen = false;
      state.selectedType = type;
      state.types = state.types.splice(index, 1).concat(state.types);
      return state;
    });
  },
  onSelectOpen() {
    this.setState({selectOpen: true});
  },
  onChange(type, value) {
    this.setState({[type]: value});
  },
  componentDidMount() {
    document.addEventListener('click', (e) => {
      if(e.target != this.refs.select) {
        this.setState({selectOpen: false});
      }
    });
    setTimeout(() => {
      this.refs.id.value = '';
      this.refs.id.focus();
    }, 0);
  },
  getNewExamId() {
    api.getNewExam({
      "examType": 1,
      "username": "Millet",
      "title": "Millet的测试试题",
      "mobile": 10000,
      "passScore": 30,
      "timeLimit": 60*30*1000
    }).then((content) => {
      this.setState((state) => {
        state = this.getInitialState();
        state.examId = content.examId;
        return state;
      });
    });
  },
  render() {
    var selectOpen = this.state.selectOpen;
    var types = this.state.types;
    var selectedType = this.state.selectedType;
    var examId = this.state.examId;
    var startUrl = 'javascript:;';
    if(selectedType.value == 'id') {
      startUrl = '/' + examId;
    }
    return (
      <DefaultLayout
        {...this.props}
        css={['common', 'index']}
        js={['boot', 'index']}>
        <div className={style.container}>
          <div className={classnames(style.inputGroup, 'clearfix')}>
            <div className={classnames(style.selectType, {[style.open]: selectOpen})}>
              <span onClick={this.onSelectOpen} ref="select">{selectedType.label}</span>
              <ul>
                {
                  types.map((type, index) => {
                    return <li key={index} onClick={this.onSelect.bind(this, type, index)}>{type.label}</li>
                  })
                }
              </ul>
            </div>
            {
              selectedType.value == 'id' && <input ref="id" value={examId}
                                                   onKeyUp={(e) => {e.keyCode==13 && (window.location = startUrl)}}
                                                   onChange={(e) => this.onChange('examId', e.target.value)}
                                                   className={style.inputId} placeholder="请输入16位考试编号"/>
            }
            {
              selectedType.value == 'info' && <span>
                <input className={style.inputName} placeholder="姓名"/>
                <input className={style.inputPhone} placeholder="手机号"/>
              </span>
            }
          </div>
          <a href={startUrl} className={style.btnStart}>开始答题</a>

          <div className={style.help}>没有考号？<a href="javascript:;" onClick={this.getNewExamId}>点我生成一个</a></div>
        </div>
      </DefaultLayout>
    );
  }
});

module.exports = Index;