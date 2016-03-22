/**
 * Created by zhengguo.chen on 2016/2/16.
 */
//browser area for webpack
if(typeof window !== "undefined") {
  require('./css/canvas.less');
}

var React = require('react');
var DefaultLayout = require('./../layouts/default.jsx');

var Canvas = React.createClass({
  componentDidMount() {

  },
  render() {
    var img = require('./img/favicon' + '_5.png');
    return (
      <DefaultLayout
        {...this.props}
        css={['common', 'components', 'canvas']}
        js={['boot', 'canvas']}>

        <div id="myCanvas" width="300" height="300"></div>
      </DefaultLayout>
    );
  }
});

module.exports = Canvas;