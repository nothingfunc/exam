var router = require('express').Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('xx')
});

/* GET users listing. */
router.get('/:username', function(req, res, next) {
  res.render('users', {
    ASSETS: global.ISOMORPHIC_ASSETS,
    title:'users',
    params: req.params
  });
});

module.exports = router;
