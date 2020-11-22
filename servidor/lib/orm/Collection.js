class Collection {
  original  = [];
  construct = ''

  constructor(values = [], model) {
    let _values = [];
    for (let value of values) {
      let _model = model.constructor.instance();

      for(let key in value) {
        _model[key] = value[key];
      }

      _values.push(_model);
    }

    this.original = _values;
    this.construct = model.constructor;
  }

  info() {
    let len = this.original.length;
    return {
      min: 0,
      max: (len - 1 < 0) ? 0 : len -1
    };
  }

  static instance(value, model) {
    return new Collection(value, model);
  }

  getModelData() {
    let _models = [];

    for(let value of this.original) {
      
    }
  }

  first() {
    let info = this.info();
    return this.original[info.min];
  }

  last() {
    let info = this.info();
    return this.original[info.max];
  }

  async decrypt(app, funcName) {
    let model = this.construct.getEncrypt();
    let values = [];

    // console.log(this);
    for(let value of this.original) {
      try {
        for(let column of model) {
          // if (value['updated_at']) {
          //   console.log(value['updated_at']);
          // }
          value[column] = await app[funcName](value[column], value['updated_at'] || value['created_at']);
        }
  
        values.push(value);
      } catch (error) {
        console.log(error);      
      }
    }

      this.original = values;

  }

  toArray() {
    let arrayData = [];

    for(let value of this.original) {
      arrayData.push(Object.assign({}, value));
    }

    return arrayData;
  }
}

module.exports = Collection;