const Modules = require('./modules');
const paths = require('../paths');

class Directory extends Modules {
  constructor() { super(); }

  readdir(path) {
    return this.fs.readdirSync(path);
  }

  getFile(path, encoding = { encoding: 'utf-8' }) {
    return this.fs.readFileSync(path, encoding);
  }

  getPublicDir() {
    return `${this.__dirname}${this.paths.dir}${this.paths.public}`;
  }

  getLangDir(file) {
    let publicPath = this.getPublicDir();
    let langDir = `${publicPath}${this.paths.lang}`;
    return (file) ? `${langDir}${file}` : langDir;
  }

  setDir(__dir = '') {
    this.paths = paths(this.process.platform);
    this.__dirname = __dir
  }
}

module.exports = Directory;