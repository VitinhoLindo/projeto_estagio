const Connect = require('../lib/orm/client');

const table = 'iten';
const timestamp = true;

const model = {
  id: 'required|interger',
  nome: 'required|string',
  marca: 'required|string',
  modelo: 'required|string',
}

const encryptData = ['nome', 'modelo'];

class Iten extends Connect {
  constructor() { super(); }

  static getTimestamp() {
    return timestamp;
  }

  static getTable() {
    return table;
  }

  static getModel(data) {
    let _data = {};

    if (data) {
      for(let key in model) {
        if (key == 'id') continue;
        if (!data[key]) continue;
        _data[key] = data[key]; 
      }

      return _data;
    }

    return model;
  }

  static getEncrypt() {
    return encryptData;
  }

  static instance() {
    return new Iten();
  }
}

module.exports = Iten;