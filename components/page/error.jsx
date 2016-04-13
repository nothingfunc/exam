/**
 * Created by zhengguo.chen on 2016/2/1.
 */
var React = require('react');
var DefaultLayout = require('./../layouts/default.jsx');

var Error = React.createClass({
  render() {
    return (
      <DefaultLayout title="出错啦">
        <h1>出错啦: {this.props.code}</h1>
        <h2><small>{this.props.message}</small></h2>
        <p>5秒后跳转首页...</p>
        <p>{this.props.error}</p>
        <script dangerouslySetInnerHTML={{__html: `
          setTimeout(function() {
            window.location.href = '/';
          }, 5000);
        `}}/>
      </DefaultLayout>
    );
  }
});

module.exports = Error;