/**
 * Created by zhengguo.chen on 2016/2/1.
 */
var React = require('react');

var DefaultLayout = React.createClass({
  render() {
    var favicon = require('./img/favicon.png');
    var ASSETS = this.props.ASSETS;
    return (
      <html>
        <head>
          <meta charSet="utf-8"/>
          <title>sss</title>
          <link rel="shortcut icon" href={favicon} type="image/x-icon"/>
          {
            this.props.css && this.props.css.map((css, index) => {
              return <link key={index} rel="stylesheet" href={ASSETS.styles[css]}/>
            })
          }
        </head>
        <body>
          {this.props.children}
          {
            this.props.js && this.props.js.map((js, index) => {
              return <script key={index} src={ASSETS.javascript[js]}></script>
            })
          }
        </body>
      </html>
    );
  }
});

module.exports = DefaultLayout;