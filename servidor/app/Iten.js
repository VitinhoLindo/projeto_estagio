const Connect = require('../lib/orm/client');

const table = 'iten';
const timestamp = true;
const model = {
  nome: 'required|string',
  marca: 'required|string',
  model: 'required|string',
  responsavel: 'interger',
  data: 'date'
}

class Iten extends Connect {
  constructor(_table, _model, _timestamp = false) { super(_table, _model, _timestamp); }

  static getModel() {
    return model;
  }

  static instance() {
    return new Iten(table, model, timestamp);
  }
}

module.exports = Iten;