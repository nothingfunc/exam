/**
 * Created by zhengguo.chen on 2016/3/23.
 */
var mongoose = require('mongoose');
var CONFIG = require('../config.json');

//db connect
const connectToDb = () => {
  console.log('Try to connect to db');
  mongoose.connect(CONFIG.DB_NAME);
};
mongoose.connection.on('error', (err) => {
  setTimeout(connectToDb, 3000);
}).on('open', () => {
  console.log('Connect to db successfully!');
});
connectToDb();
