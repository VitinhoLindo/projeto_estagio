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

  cacheCrypto() {
    let cache = this.app.getCache(this.request.socket.remoteAddress);
    return cache ? true : false;
  }

  getRandomIvs(ivs = [new Uint8Array(16)]) {
    let index = this.app.randomNumber(0, ivs.length - 1);
    return ivs[index];
  }

  async decrypt(value) {
    let cache = this.app.getCache(this.request.socket.remoteAddress);

    if (!cache || !cache.server || !cache.server.priv) {
      throw `dont\'t exists server private key for ${this.request.socket.remoteAddress}`;
    }

    let decryptoBuffer = null, count = 0;
    let bufferValue = Buffer.from(value, 'hex');

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

    return Buffer.from(encryptBuffer).toString('hex');
  }

  async encryptOrDecryptObject(param, func) {
    let object = {};

    for (let key in param) {
      let value = param[key];
      let _k = await this[func](key), _v;

      if (!value) {
        _v = null;
        continue;
      }
      switch (value.constructor.name) {
        case 'Object':
          _v = await this.encryptOrDecryptObject(value, func); break;
        case 'Array':
          _v = await this.encryptOrDecryptArray(value, func); break;
        default:
          _v = await this.encryptOrDecrypt(value, func); break;
      }

      object[_k] = _v;
    }

    return object;
  }

  async encryptOrDecryptArray(param, func) {
    let array = [];

    for (let value of param) {
      let _v;

      if (!value) {
        _v = null;
        continue;
      }
      switch (value.constructor.name) {
        case 'Object':
          _v = await this.encryptOrDecryptObject(value, func); break;
        case 'Array':
          _v = await this.encryptOrDecryptArray(value, func); break;
        default:
          _v = await this.encryptOrDecrypt(value, func); break;
      }

      array.push(_v);
    }

    return array;
  }

  async encryptOrDecrypt(value, func) {
    if (!value) return null;

    switch (value.constructor.name) {
      case 'String':
        return await this[func](value);
      case 'Number':
        return await this[func](value.toString());
      case 'Object':
        return await this.encryptOrDecryptObject(value, func);
      case 'Array':
        return await this.encryptOrDecryptArray(value, func);
      case 'Date':
        return await this[func](value.toJSON());
      default: {
        return null;
      }
    }
  }

  // async decrypt(value = '') {
  //   let cache = this.app.getCache(this.request.socket.remoteAddress);

  //   if (!cache || !cache.server || !cache.server.priv) {
  //     throw `dont\'t exists server private key for ${this.request.socket.remoteAddress}`;
  //   }

  //   let decryptoBuffer = null, count = 0;
  //   let bufferValue = Buffer.from(value, 'base64');

  //   while(count < 10) {
  //     try {
  //       decryptoBuffer = await this.app.crypto.webcrypto.subtle.decrypt({
  //         name: this.app.serverKeyAlgorithm,
  //         hash: this.app.serverKeyHash,
  //         iv: cache.ivs[count]
  //       }, cache.server.priv, bufferValue);
    
  //       break;
  //     } catch (error) { }
  //     count++;
  //   }

  //   if (decryptoBuffer) {
  //     return Buffer.from(decryptoBuffer, 'utf-8').toString();
  //   }
  //   else {
  //     throw 'failure in decrypt data';
  //   }
  // }

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

  sendError(error) {
    try {
      if (error.constructor.name == 'Object') {
        return this.defaultResponseJSON(error);
      }
      return this.defaultResponseJSON({ code: 500, message: 'internal server error' });
    } catch (error) { 
      this.request.socket.destroy(err => {});
    }
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