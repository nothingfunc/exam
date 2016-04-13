/**
 * Created by zhengguo.chen on 2016/2/1.
 */
//browser area for webpack

var React = require('react');
var DefaultLayout = require('./../layouts/default.jsx');
var XX = require('./../list/xx.jsx');
var classnames = require('classnames');

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
      selectOpen: false
    }
  },
  onStartClick() {
    console.log(Date.now())
  },
  onSelect(type, index) {
    console.log(index)
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
  componentDidMount() {
    document.addEventListener('click', (e) => {
      if(e.target != this.refs.select) {
        this.setState({selectOpen: false});
      }
      console.log(e);
    });
  },
  render() {
    var selectOpen = this.state.selectOpen;
    var types = this.state.types;
    var selectedType = this.state.selectedType;
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
              selectedType.value == 'id' && <input className={style.inputId} placeholder="请输入16位试题编号"/>
            }
            {
              selectedType.value == 'info' && <span>
                <input className={style.inputName} placeholder="姓名"/>
                <input className={style.inputPhone} placeholder="手机号"/>
              </span>
            }
          </div>
          <a href="javascript:;" className={style.btnStart} onClick={this.onStartClick}>开始答题</a>
          <p>请输入姓名手机或考试编号开始答题</p>
        </div>
      </DefaultLayout>
    );
  }
});

module.exports = Index;