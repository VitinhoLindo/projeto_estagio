const Connect = require('../lib/orm/client');

const table = 'marca';
const timestamp = true;
const model = {
  id: 'interger',
  nome: 'string',
  created_at: 'datetime',
  updated_at: 'datetime'
}

const encryptData = ['nome'];

class Mark extends Connect {
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
    return new Mark(table, model, timestamp);
  }
}

module.exports = Mark;