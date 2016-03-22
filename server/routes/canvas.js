var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('canvas', {
    ASSETS: global.ISOMORPHIC_ASSETS,
    title:'Make expression'
  });
});

module.exports = router;
