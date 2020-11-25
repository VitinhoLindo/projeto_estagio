const Connect = require('../lib/orm/client');

const table = 'aluguel';
const timestamp = true;
const model = {
  id: 'required|interger',
  colaborador: 'required|interger',
  iten: 'required|interger',
  expiration_at: 'required|datetime',
}

const encryptData = [];

class Rent extends Connect {
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
    return new Rent();
  }
}

module.exports = Rent;