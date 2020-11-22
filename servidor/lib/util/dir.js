const Modules = require('./modules');
const paths = require('../paths');

class Directory extends Modules {
  constructor() { super(); }

  readdir(path) {
    return this.fs.readdirSync(path);
  }

  getFile(path, encoding = { encoding: 'utf-8' }) {
    try {
      return this.fs.readFileSync(path, encoding);
    } catch (error) {
      return null;
    }
  }

  setFile(path, value, encoding = { encoding: 'utf-8' }) {
    this.fs.writeFileSync(path, value, encoding);
  }

  getPublicDir() {
    return `${this.__dirname}${this.paths.dir}${this.paths.public}`;
  }

  getLangDir(file) {
    let publicPath = this.getPublicDir();
    let langDir = `${publicPath}${this.paths.lang}`;
    return (file) ? `${langDir}${file}` : langDir;
  }

  getLibDir() {
    return `${this.__dirname}${this.paths.dir}${this.paths.lib}`;
  }

  getLibDatabaseDir() {
    let libDir = this.getLibDir();
    return `${libDir}${this.paths.database}`;
  }

  getCryptoDir(file) {
    let databaseDir = this.getLibDatabaseDir();
    let cryptoDir = `${databaseDir}${this.paths.crypto}`;
    return file ? `${cryptoDir}${file}` : cryptoDir
  }

  setDir(__dir = '') {
    this.paths = paths(this.process.platform);
    this.__dirname = __dir
  }
}

module.exports = Directory;