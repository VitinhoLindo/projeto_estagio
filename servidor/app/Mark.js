const Connect = require('../lib/orm/client');

const table = 'marca';
const model = {
  nome: 'required|string'
}

class Mark extends Connect {
  constructor(_table, _model) { super(_table, _model); }

  static getModel() {
    return model;
  }

  static instance() {
    return new Mark(table, model);
  }
}

module.exports = Mark;