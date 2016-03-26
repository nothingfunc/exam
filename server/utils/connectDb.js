/**
 * Created by zhengguo.chen on 2016/3/23.
 */
var mongoose = require('mongoose');
var configModel = require('../model/config');

//db connect
const connectToDb = () => {
  console.log('Try to connect to db');
  configModel.getConfig().then((config) => {
    mongoose.connect(config.DB_NAME);
  })
};
mongoose.connection.on('error', (err) => {
  setTimeout(connectToDb, 3000);
}).on('open', () => {
  console.log('Connect to db successfully!');
});
connectToDb();
