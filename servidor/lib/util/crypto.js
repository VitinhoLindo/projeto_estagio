const CryptoUtil = require('./cryptoUtil');

class Crypto extends CryptoUtil {
  usage = {
    key: '',
    iv: ''
  };

  constructor() { super(); }

  generateKey(pass = this.randomString(this.passLen)) {
    return this.crypto.scryptSync(
      pass,
      this.salt,
      this.saltRang
    )
  }

  getEncrypt(key = this.generateKey(), iv = this.getIv()) {
    return this.crypto.createCipheriv(
      this.cryptoAlgorithm,
      key,
      iv
    );
  }

  getDecrypt(key = this.generateKey(), iv = this.getIv()) {
    return this.crypto.createDecipheriv(
      this.cryptoAlgorithm,
      key,
      iv
    )
  }

  async encrypt(value) {
    let encrypted = '';
    let encrypt = this.getEncrypt(this.usage.key, this.usage.iv);

    encrypted += encrypt.update(value, 'utf8', 'hex');
    encrypted += encrypt.final('hex');

    return encrypted;
  }

  async decrypt(value) {
    let decrypted = '';
    let decrypt = this.getDecrypt(this.usage.key, this.usage.iv);

    decrypted += decrypt.update(value, 'hex', 'utf8');
    decrypted += decrypt.final('utf8');

    return decrypted;
  }

  async generateKeys() {
    let { publicKey, privateKey } = await this.crypto.webcrypto.subtle.generateKey({
      name: this.serverKeyAlgorithm,
      modulusLength: this.modulusLength,
      publicExponent: this.publicExponent,
      hash: this.serverKeyHash
    }, true, ['encrypt', 'decrypt']);

    return { publicKey, privateKey };
  }

  getHash() {
    return this.crypto.createHash(this.hashAlgorithm);
  }

  hash(value = '') {
    let hash = this.getHash();

    return hash.update(value).digest('hex');
  }

  async importKey(binary = new ArrayBuffer(), type = ['encrypt']) {
    return await this.crypto.webcrypto.subtle.importKey(
      this.exportPublicType,
      binary,
      {
        name: this.serverKeyAlgorithm,
        hash: this.serverKeyHash
      },
      false, type
    );
  }

  async exportKey(key) {
    return this.crypto.webcrypto.subtle.exportKey(
      this.exportPublicType,
      key
    );
  }

  readKey() {
    let opt = {
      key : this.process.env.KEY,
      iv  : this.process.env.IV
    }

    if (!opt.key && !opt.iv) throw 'invalid server config set KEY and IV to env';

    this.usage = {
      key: this.generateKey(opt.key),
      iv : this.hexToBinary(opt.iv)
    }
  }

  // getDirCrypto(date = new Date()) {
  //   let dateObject = this.getMtDate(date).dateObject();

  //   return this.getCryptoDir(`crypto-${dateObject.currentDate}.json`)
  // }

  // async getCacheDate(date = new Date()) {
  //   let dateObject = this.getMtDate(date).dateObject();
  //   let key = this.keys[dateObject.currentDate];

  //   if (key) {
  //     return key;
  //   } else {
  //     let dirFile  = this.getDirCrypto(date);
  
  //     key = await this.getFile(dirFile, { encoding: 'utf-8' });

  //     if (!key) return null;

  //     key = JSON.parse(key);
  //     this.keys[dateObject.currentDate] = {
  //       pass: key.pass,
  //       key : this.generateKey(key.pass),
  //       iv  : Buffer.from(key.iv, 'hex')
  //     };

  //     return this.keys[dateObject.currentDate];
  //   }
  // }

  // async newCrypto(dateObject = this.getMtDate().dateObject()) {
  //   let cryptoKey = await this.getCacheDate(dateObject.currentDateObject);

  //   if (!cryptoKey) {
  //     let pass = this.hash(
  //       this.randomString(
  //         this.passLen
  //       )
  //     );
  //     let key  = this.generateKey(pass);
  //     let iv   = Buffer.from(this.getIv());

  //     let dirAndFile = this.getCryptoDir(`crypto-${dateObject.currentDate}.json`);
  //     await this.setFile(dirAndFile, JSON.stringify({
  //       pass: pass,
  //       iv : Buffer.from(iv, 'binary').toString('hex')
  //     }), { encoding: 'utf-8' });
  //     this.keys[dateObject.currentDate] = {
  //       pass: pass,
  //       key : key,
  //       iv  : iv
  //     };
  //     return;
  //   }
  // }

  // cryptoListen() {
  //   this.newCrypto();
  //   setInterval(() => {
  //     let dateObject = this.getMtDate().dateObject();

  //     if (dateObject.time.hour == 0 && dateObject.time.minute == 0) {
  //       this.newCrypto();
  //     }
  //   }, 30000);
  // }
}

module.exports = Crypto;