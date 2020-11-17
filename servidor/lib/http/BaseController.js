const express = require('express');
const Validator = require('./Validator');

class ResponseModel {
  requestStatus = 0;
  requestMessage = '';
  time = 0;
  message = '';
  result = {};
  code = 0;
  status = '';

  constructor() { }
}

const currentTime = function () {
  return new Date().getTime();
}

class BaseController {
  request = express.request;
  response = express.response;
  Validator = Validator;
  app = require('../../app')();

  constructor(_request, _response) {
    this.request = _request;
    this.response = _response;
    this.app = _request.getApp();
  }

  getRandomIvs(ivs = [new Uint8Array(16)]) {
    let index = this.app.randomNumber(0, ivs.length - 1);
    return ivs[index];
  }

  async encrypt(value) {
    let cache = this.app.getCache(this.request.socket.remoteAddress);

    if (!cache || !cache.app || !cache.app.pub) {
      throw `dont\'t exists app public key for ${this.request.socket.remoteAddress}`;
    }
    
    let encryptBuffer = await this.app.crypto.webcrypto.subtle.encrypt({
      name: this.app.serverKeyAlgorithm,
      hash: this.app.serverKeyHash,
      iv: this.getRandomIvs(cache.ivs)
    }, cache.app.pub, Buffer.from(value, 'utf-8'));

    return Buffer.from(encryptBuffer).toString('base64');
  }

  dataString(value) {
    switch (value.constructor.name) {
      case 'String':
        return value;
      case 'Date':
        return value.toJSON();
      case 'Number':
        return value.toString();
    }
  }

  async encryptObject(data) {
    let objectEncrypted = {};

    for(let key in data) {
      let value = this.dataString(data[key]);
      let _k = await this.encrypt(key),
          _v = await this.encrypt(value);

      objectEncrypted[_k] = _v;
    }

    return objectEncrypted;
  }

  async decryptObject(data = {}) {
    let objectDecrypted = {};

    for(let key in data) {
      let _k = await this.decrypt(key), 
          _v = await this.decrypt(data[key]);

      objectDecrypted[_k] = _v;
    }

    return objectDecrypted;
  }

  async decrypt(value = '') {
    let cache = this.app.getCache(this.request.socket.remoteAddress);

    if (!cache || !cache.server || !cache.server.priv) {
      throw `dont\'t exists server private key for ${this.request.socket.remoteAddress}`;
    }

    let decryptoBuffer = null, count = 0;
    let bufferValue = Buffer.from(value, 'base64');

    while(count < 10) {
      try {
        decryptoBuffer = await this.app.crypto.webcrypto.subtle.decrypt({
          name: this.app.serverKeyAlgorithm,
          hash: this.app.serverKeyHash,
          iv: cache.ivs[count]
        }, cache.server.priv, bufferValue);
    
        break;
      } catch (error) { }
      count++;
    }

    if (decryptoBuffer) {
      return Buffer.from(decryptoBuffer, 'utf-8').toString();
    }
    else {
      throw 'failure in decrypt data';
    }
  }

  all() {
    let all = {};

    if (this.request.query && this.request.query.constructor.name == 'Object') all = Object.assign({}, all, this.request.query);
    if (this.request.params && this.request.params.constructor.name == 'Object') all = Object.assign({}, all, this.request.params);
    if (this.request.body && this.request.body.constructor.name == 'Object') all = Object.assign({}, all, this.request.body);

    return all;
  }

  _user() {
    return this.app.getUser(this.request);
  }

  setStatus(code) {
    this.response.status(code);
  }

  setMessage(message) {
    this.response.statusMessage = message;
  }

  resJson(data) {
    this.response.json(data);
    return data;
  }

  resEnd() {
    this.response.end();
  }

  defaultResponseJSON(_response = new ResponseModel) {
    if (!_response.requestStatus) _response.requestStatus = 200;
    if (!_response.requestMessage) _response.requestMessage = 'Success';
    if (!_response.time) _response.time = currentTime();
    if (!_response.message) _response.message = 'Success response message';
    if (!_response.code) _response.code = 200;
    if (!_response.result) _response.result = {};
    if (!_response.status) _response.status = (
      _response.code >= 200 &&
      _response.code < 300
    ) ? 'success' : 'error';
    
    this.resJson({
      time: _response.time,
      message: _response.message,
      code: _response.code,
      status: _response.status,
      result: _response.result
    });
    this.setStatus(_response.requestStatus);
    this.setMessage(_response.requestMessage);
    this.resEnd();
  }

  static using(_request, _response) {
    let Controller = this.estance();
    return new Controller(_request, _response);
  }

  sendFile(path) {
    this.response.sendFile(path, (err) => {
      if (err == undefined) this.resEnd();
      else {
        this.defaultResponseJSON({
          code: 404,
          message: 'error in response file'
        });
        this.resEnd();
      }
    });
  }
}

module.exports = BaseController;