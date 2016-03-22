/**
 * Created by zhengguo.chen on 2016/2/1.
 */
var React = require('react');
var DefaultLayout = require('./../layouts/default.jsx');

var Error = React.createClass({
  handleClick() {
    console.log(123);
  },
  render() {
    return (
      <DefaultLayout title={this.props.message}>
        <h1>出错啦: {this.props.code}</h1>
        <h2><small>{this.props.message}</small></h2>
        <p>50秒后跳转首页...</p>
        <p>{this.props.error}</p>
        <script dangerouslySetInnerHTML={{__html: `
          setTimeout(function() {
            window.location.href = '/';
          }, 50000);
        `}}/>
      </DefaultLayout>
    );
  }
});

module.exports = Error;