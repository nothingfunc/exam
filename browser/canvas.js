/**
 * Created by zhengguo.chen on 2016/2/16.
 */
var boot = require('./boot');
var entry = require('../components/page/canvas.jsx');
boot(entry);

var img1 = require('../components/page/img/favicon.png');
var img2 = require('./bunny.png');


require.ensure(['./lib/pixi/pixi.min'], function(require) {
  var PIXI = require('./lib/pixi/pixi.min');
  var renderer = PIXI.autoDetectRenderer(300, 300,{backgroundColor : 0x1099bb});
  document.getElementById('myCanvas').appendChild(renderer.view);

  // create the root of the scene graph
  var stage = new PIXI.Container();

  // create a texture from an image path
  var texture = PIXI.Texture.fromImage(img1);
  var texture2 = PIXI.Texture.fromImage(img2);

  // create a new Sprite using the texture
  var bunny = new PIXI.Sprite(texture);
  var bunny2 = new PIXI.Sprite(texture2);

  // center the sprite's anchor point
  bunny.anchor.x = 0.5;
  bunny2.anchor.x = 0.5;
  bunny.anchor.y = 0.5;
  bunny2.anchor.y = 0.5;

  // move the sprite to the center of the screen
  bunny.position.x = 200;
  bunny2.position.x = 100;
  bunny.position.y = 150;
  bunny2.position.y = 100;

  stage.addChild(bunny);
  stage.addChild(bunny2);

  // start animating
  animate();
  function animate() {
    requestAnimationFrame(animate);

    // just for fun, let's rotate mr rabbit a little
    bunny.rotation += 0.1;
    bunny2.rotation += 0.1;

    // render the container
    renderer.render(stage);
  }
});

