/**
 * Created by zhengguo.chen on 2016/2/1.
 */
//browser area for webpack

var React = require('react');
var DefaultLayout = require('./../layouts/default.jsx');
var XX = require('./../list/xx.jsx');
var style = require('./css/index.less');

var Index = React.createClass({
  handleClickImg() {
    console.log(Date.now())
  },
  componentDidMount() {
  },
  render() {
    var img = require('./img/favicon' + '_5.png');
    return (
      <DefaultLayout
        {...this.props}
        css={['common', 'components', 'index']}
        js={['boot', 'index']}>
        <div className={style.hello}>Hello {this.props.name}</div>
        <img src={img} onClick={this.handleClickImg}/>
        {
          this.props.list.map((item, index) => {
            return <i key={index}>{item} </i>
          })
        }
        <XX/>
      </DefaultLayout>
    );
  }
});

module.exports = Index;