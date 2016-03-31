/**
 * Created by zhengguo.chen on 2016/3/24.
 */
var React = require('React');
var classnames = require('classnames');
var _ = require('lodash');
var style = require('./style.less');

module.exports = React.createClass({
  getInitialState() {
    return {
      remainTime: this.props.remainTime
    }
  },
  getDefaultProps() {
    return {
      onOk: ()=>{},
      onCancel: ()=>{}
    }
  },
  render() {
    var {remainTime} = this.state;
    var {className, title, msg, onOk, onCancel, hidden} = this.props;
    return <div className={classnames(className, style.dialog)} style={{display: hidden?'none':'block'}}>
      <div className={style.content}>
        {title && <h2>{title}</h2>}
        <p>{msg}</p>
        <div className={style.control}>
          <a href="javascript:;" onClick={onCancel}>取消</a>
          <a href="javascript:;" onClick={onOk}>确定</a>
        </div>
      </div>
    </div>
  }
});