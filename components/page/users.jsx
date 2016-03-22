/**
 * Created by zhengguo.chen on 2016/2/1.
 */
//browser area
if(typeof window !== "undefined") {
  require('./css/users.less');
}

var React = require('react');
var DefaultLayout = require('./../layouts/default.jsx');

var Index = React.createClass({
  componentDidMount() {
    console.log(123);
  },
  render() {
    return (
      <DefaultLayout
        {...this.props}
        css={['common', 'components', 'users']}
        js={['boot', 'users']}>
        <div>Hello {this.props.params.username}</div>
      </DefaultLayout>
    );
  }
});

module.exports = Index;
