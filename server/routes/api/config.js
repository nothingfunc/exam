var router = require('express').Router();
var lodash = require('lodash');
var response = require('../../utils/response');
var configModel = require('../../model/config');

// 获取配置
router.get('/', (req, res, next) => {
  configModel.getConfig().then((data) => {
    response.success(res, data, 'Get config successfully');
  }).catch((err) => {
    response.error(res, err);
  });
});

// 修改配置
router.put('/', (req, res, next) => {
  configModel.saveConfig(req.body).then((data) => {
    response.success(res, data, 'Save config successfully');
  }).catch((err) => {
    response.error(res, err);
  });
});

module.exports = router;
