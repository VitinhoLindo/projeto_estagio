const Loggable = require('./loggable');

class Cache extends Loggable {
  constructor() { super(); }

  saveCache(index, value) {
    if (!this.cache[index]) {
      this.cache[index] = value;
      return;
    }
    
    if (this.cache[index].constructor.name == 'Object' && value.constructor.name == 'Object') {
      this.cache[index] = Object.assign({}, this.cache[index], value);
      return;
    }
    
    this.cache[index] = value;
    return;
  }

  getCache(index) {
    return this.cache[index] || null;
  }

  deleteCache(index) {
    if (this.cache[index]) {
      delete this.cache[index];
      return true;
    }
    return false;
  }

  async cacheClearCryptoKeys() {
    for(let address in this.cache) {
      if (!/\d{2,10}\.\d{1,9}\.\d{1,9}\.\d{2,10}/g.test(address)) continue;

      let mtDate = this.getMtDate(this.cache[address].cryptoGenerate);

      if (mtDate.addMinutes(10).get() >= new Date()) {
        if (this.cache[address].cryptoGenerate) delete this.cache[address].cryptoGenerate;
        if (this.cache[address].app)            delete this.cache[address].app;
        if (this.cache[address].server)         delete this.cache[address].server;
      }
    }
  }
}

module.exports = Cache;