/**
 * Created by zhengguo.chen on 2016/3/21.
 */

// just for test

var path = require('path');
var crypto = require('crypto');

var fs = require('q-io/fs');

//better way:
//var fs = require('fs');
//Q.denodeify(fs.readFile)(__dirname + '/json.js', 'utf-8').then(content => {
//  //console.log('readFile', content);
//});
//
//Q.nfcall(fs.readFile, __dirname + '/json.js', 'utf-8').then(content => {
//  //console.log(content);
//})

const DATA_PATH = path.join(__dirname, '../../data/data.json');

const md5 = (content) => {
  var md5Maker = crypto.createHash('md5');
  return md5Maker.update(content).digest('hex');
};
const getData = () => {
  return fs.read(DATA_PATH).then((content) => {
    return JSON.parse(content);
  })
};
const saveData = (data) => {
  console.log('saveData', data);
  return fs.write(DATA_PATH, JSON.stringify(data));
};

module.exports = {
  addQuestion(item) {
    return getData().then((data) => {
      data.questions.push(item);
      return data;
    });
  },
  getQuestions() {
    return getData();
  },
  createExam() {
    var now = Date.now();
    var id = md5('p' + now + '|' + Math.random());
    var item = {title:'hello', id:id, createTimestamp: now, startTimestamp: 0, totalTime: 10*1000};
    return getData().then((data) => {
      data.pages[id] = item;
      return saveData(data).then(() => {
        return item;
      });
    });
  },
  getExam(id) {
    return getData().then((data) => {
      var now = Date.now();
      var item = data.pages[id];
      if(item) {
        item.startTimestamp = item.startTimestamp || now;
        //删除过期考卷
        if(now - item.startTimestamp > item.totalTime) {
          delete data.pages[id];
          return saveData(data).then(() => {
            return {'result': 'No such exam or it has been deleted!'};
          });
        }
        return saveData(data).then(() => {
          return item;
        });
      } else {
        return {'result': 'No such exam or it has been deleted!'};
      }
    });
  },
  deleteExam(id) {
    return getData().then((data) => {
      delete data.pages[id];
      return saveData(data).then(() => {
        return data;
      });
    });
  }
};