class Collection {
  original  = [];
  construct = ''

  constructor(value = [], model) { 
    this.original = value;
    
    
  }

  static instance(value, model) {
    return new Collection();
  }
}

module.exports = Collection;