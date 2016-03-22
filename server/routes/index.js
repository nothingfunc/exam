var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var a = 'Express xx xxx';
  res.render('index', {
    ASSETS: global.ISOMORPHIC_ASSETS,
    title: a,
    name: 'Mill'+'et',
    list: ['hi', 'yes', 'bad']
  });
});

module.exports = router;
