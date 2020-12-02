const Cache = require('./cache');

class CryptoUtil extends Cache {
  constructor() { super(); }

  getIv() {
    return this.crypto.webcrypto.getRandomValues(new Uint8Array(this.ivLen));
  }

  arrayBufferToBase64String(binary = new ArrayBuffer()) {
    return Buffer.from(binary).toString('base64');
  }

  base64ToArrayBuffer(base64 = '') {
    return Buffer.from(base64, 'base64');
  }

  getHexUsingString(value = '') {
    return Buffer.from(value, 'utf-8').toString('hex')
  }

  binaryToHex(binary = new ArrayBuffer()) {
    return Buffer.from(binary).toString('hex');
  }

  hexToBinary(hex = '') {
    return Buffer.from(hex, 'hex');
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
}

module.exports = CryptoUtil;