/**
 * Created by zhengguo.chen on 2016/2/2.
 */
var React = require('react');

var style = require('./xx.less');
console.log(style.list);

module.exports = React.createClass({
  render() {

    return <ul className={style.list}><li>
      <i className="icon icon-qqicon"></i> Hello33</li><li>Millet</li>
    </ul>
  }
});
