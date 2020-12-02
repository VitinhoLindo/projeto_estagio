const Connect = require('../lib/orm/client');

const table = 'login';
const timestamp = true;

const model = {
  id: 'required|interger',
  email: 'required|string',
  senha: 'required|string'
}

const encryptData = ['email', 'senha'];

class Login extends Connect {
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
    return new Login();
  }
}

module.exports = Login;