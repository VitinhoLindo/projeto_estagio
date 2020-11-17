const Connect = require('../lib/orm/client');

const table = 'iten';
const model = {
  nome: 'required|string',
  marca: 'required|string',
  model: 'required|string',
  responsavel: 'interger',
  data: 'date'
}

class Iten extends Connect {
  constructor(_table, _model) { super(_table, _model); }

  static getModel() {
    return model;
  }

  static instance() {
    return new Iten(table, model);
  }
}

module.exports = Iten;