const Cache = require('./cache');

class Crypto extends Cache {
  keys = {};

  constructor() { super(); }

  getDirCrypto(date = new Date()) {
    let dateObject = this.getMtDate(date).dateObject();

    return this.getCryptoDir(`crypto-${dateObject.currentDate}.json`)
  }

  async getCacheDate(date = new Date()) {
    let dateObject = this.getMtDate(date).dateObject();
    let key = this.keys[dateObject.currentDate];

    if (key) {
      return key;
    } else {
      let dirFile  = this.getDirCrypto(date);
  
      key = await this.getFile(dirFile, { encoding: 'utf-8' });

      if (!key) return null;

      key = JSON.parse(key);
      this.keys[dateObject.currentDate] = {
        pass: key.pass,
        key : this.generateKey(key.pass),
        iv  : Buffer.from(key.iv, 'hex')
      };

      return this.keys[dateObject.currentDate];
    }
  }

  getIv() {
    return this.crypto.webcrypto.getRandomValues(new Uint8Array(this.ivLen));
  }

  arrayBufferToBase64String(binary = new ArrayBuffer()) {
    return Buffer.from(binary).toString('base64');
  }

  base64ToArrayBuffer(base64 = '') {
    return Buffer.from(base64, 'base64');
  }

  randomNumber(min = 0, max = 0) {
    if (min > max) {
      let _max = max;
      max = min;
      min = _max;
    }

    let decimalHouse = 10;

    while(max > decimalHouse) {
      decimalHouse += 10;
    }

    let rand;

    do {
      rand = Math.floor(Math.random() * decimalHouse);
    } while (rand < min || rand > max);

    return rand;
  }

  randomString(len = 20) {
    let characters = 'abcdefghijklmnopqrstuvxywz0123456789!@#$%¨&*_-+=§{[]}ºª;:,><.°';
    let randomString = '';

    for(let x = 0; x < len; x++) {
      let index = this.randomNumber(0, characters.length - 1);
      randomString += characters[index];
    }

    return randomString;
  }

  getHexUsingString(value = '') {
    return Buffer.from(value, 'utf-8').toString('hex')
  }

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

  async encrypt(value, date = new Date()) {
    let cryptoKey = await this.getCacheDate(date);

    if (!cryptoKey) throw `key don't exists ${date.toJSON()}`;

    let encrypted = '';
    let encrypt = this.getEncrypt(cryptoKey.key, cryptoKey.iv);

    encrypted += encrypt.update(value, 'utf8', 'hex');
    encrypted += encrypt.final('hex');

    return encrypted;
  }

  async decrypt(value, date = new Date()) {
    let cryptoKey = await this.getCacheDate(date);

    if (!cryptoKey) throw `key don't exists ${date.toJSON()}`;

    let decrypted = '';
    let decrypt = this.getDecrypt(cryptoKey.key, cryptoKey.iv);

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

    hash.update(value);
    return hash.digest('hex');
  }

  binaryToHex(binary = new ArrayBuffer()) {
    return Buffer.from(binary).toString('hex');
  }

  hexToBinary(hex = '') {
    return Buffer.from(hex, 'hex');
  }

  binaryToPem(binary = new ArrayBuffer(), label = 'RSA PUBLIC KEY') {
    let keyBase64 = this.arrayBufferToBase64String(binary);
    let nextIndex = 0;

    let pemCert = `-----BEGIN ${label}-----\r\n`;
    while(nextIndex < keyBase64.length) {
      if (nextIndex + 64 < keyBase64.length) {
        pemCert += keyBase64.substr(nextIndex, 64) + '\r\n';
      } else {
        pemCert += keyBase64.substr(nextIndex) + '\r\n';
      }

      nextIndex += 64;
    }
    pemCert += `-----END ${label}-----\r\n`;
    return pemCert;
  }

  pemToBinary(pem = '') {
    let lines = pem.split('\n');
    let keyBase64 = '';
    
    for(let line of lines) {
      if (
        line.trim().length > 0 &&
        line.indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
        line.indexOf('-END RSA PRIVATE KEY-') < 0 &&
        line.indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
        line.indexOf('-END RSA PUBLIC KEY-') < 0
      ) {
        keyBase64 += line.trim();
      }
    }

    return this.base64ToArrayBuffer(keyBase64);
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

  async newCrypto(dateObject = this.getMtDate().dateObject()) {
    let cryptoKey = await this.getCacheDate(dateObject.currentDateObject);

    if (!cryptoKey) {
      let pass = this.hash(
        this.randomString(
          this.passLen
        )
      );
      let key  = this.generateKey(pass);
      let iv   = Buffer.from(this.getIv());

      let dirAndFile = this.getCryptoDir(`crypto-${dateObject.currentDate}.json`);
      await this.setFile(dirAndFile, JSON.stringify({
        pass: pass,
        iv : Buffer.from(iv, 'binary').toString('hex')
      }), { encoding: 'utf-8' });
      this.keys[dateObject.currentDate] = {
        pass: pass,
        key : key,
        iv  : iv
      };
      return;
    }
  }

  cryptoListen() {
    this.newCrypto();
    setInterval(() => {
      let dateObject = this.getMtDate().dateObject();

      if (dateObject.time.hour == 0 && dateObject.time.minute == 0) {
        this.newCrypto();
      }
    }, 30000);
  }
}

module.exports = Crypto;