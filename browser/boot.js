/**
 * Created by zhengguo.chen on 2016/2/2.
 */
module.exports = function(entryModule) {
  var ReactEngineClient = require('react-engine/lib/client');

  // boot options
  var options = {
    // supply a function that can be called
    // to resolve the file that was rendered.
    viewResolver: function() {
      return entryModule;
    }
  };

  document.addEventListener('DOMContentLoaded',function(){
    ReactEngineClient.boot(options, function onBoot(data, history) {
      console.log('ReactEngineClient boot successfully!');
    });
  });
}
