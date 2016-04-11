require('es6-promise');
require('whatwg-fetch');
var querystring = require('querystring');

const API_PREFIX = '/api';
const API_SUCCESS_CODE = 200;

const METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
};

const request = (url, params, method = 'post', jsonType = true) => {
  var options = {
    headers: {
      'Content-Type': jsonType ? 'application/json' : 'application/x-www-form-urlencoded'
    },
    method: method,
    credentials: 'include'
  };
  if(method !== METHOD.GET && params) {
    options.body = jsonType ? JSON.stringify(params) : qs.stringify(params)
  }
  if(method === METHOD.GET && params) {
    url += ('?' + qs.stringify(params));
  }
  return fetch(url, options).then(checkRespStatus);
};

// check resp status
const checkRespStatus = (respPromise) => {
  if(respPromise.status !== 200) {
    console.log('Server error occurred');
    return Promise.reject();
  }
  return respPromise.json().then(resp => {
    return new Promise((resolve, reject) => {
      if(resp && resp.code === API_SUCCESS_CODE) {
        resolve(resp.data);
      } else {
        resp.msg && alert(resp.msg);
        reject(resp);
      }
    });
  });
};

const getApi = (url) => API_PREFIX + url;

module.exports = {
  // choose option
  choose: (id, params) => request(getApi('/exam/' + id + '/choose'), params, METHOD.PUT),
  // submit exam
  submitExam: (id, params) => request(getApi('/exam/' + id + '/submit'), params, METHOD.POST)
};

