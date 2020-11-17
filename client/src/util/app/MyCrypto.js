import MyEvent from './MyEvent' 

class AppCrypto extends MyEvent {
  constructor() { super(); }

  /**
   * obs: retorna binarios aleatorios.
   * 
   * return new Uint8Array() [...];
   */
  getIv() {
    let vectorIndex = this.randomNumber(0, this.secret.ivs.length - 1);
    return this.secret.ivs[vectorIndex];
  }

  /**
   * @param {*} value String() || ''
   * 
   *    ex: value = 'abcde'
   *        bytes = new Uint8array(value.length) = [0,0,0,0,0];
   * 
   *        for (let index in bytes) bytes[index] = value.charCodeAt(index);
   * 
   *        return bytes = ([97, 98, 99, 100, 101] == 'abcde');
   * 
   * return new Uint8array() [...];
   * 
   */
  textToArrayBuffer(value = '') {
    let stringUtf8 = unescape(encodeURIComponent(value));
    let bytes = new Uint8Array(stringUtf8.length);

    for (let index in stringUtf8) bytes[index] = stringUtf8.charCodeAt(index);
    return bytes;
  }

  /**
   * @param {*} binary ArrayBuffer() { Int8Array, Int16Array, Int32Array, Uint8Array }
   * 
   * return String[utf-8]
   */
  arrayBufferToText(binary = new ArrayBuffer()) {
    let string = '';
    let bytes = new Uint8Array(binary);

    for(let byte of bytes) string += String.fromCharCode(byte);
    return string;
  }

  /**
   * @param {*} binary ArrayBuffer() { Int8Array, Int16Array, Int32Array, Uint8Array }
   * 
   *   obs: padrão de hexadecimal são dois caracteres [FF] que é igual a 255
   *        binario 0b1111 1111 é igual a 255
   *        logo a converção para hexadecimal simplifica a string
   *   
   *   ex: hexValye = '';
   *       bytes = new Uint8Array(binary);
   *      (bytes == [97, 98, 99, 100, 101])
   * 
   *      for (let byte of bytes) {
   *        let hex = byte.toString(16); return String['hexadecimal']
   * 
   *        hex[97] == 61
   *        hexValue = (`000${hex}`);
   *        hexValue = "00061".slice(-2);
   *        hexValue == "61";
   * 
   *        hexValue += (`000${hex}`).splice(-2);
   *      }
   * 
   * return String['hexadecimal'];
   */
  arrayBufferToHex(binary = new ArrayBuffer()) {
    let hexValue = '';
    let bytes = new Uint8Array(binary);

    for (let byte of bytes) {
      let hex = byte.toString(16);
      hexValue += (`000${hex}`).slice(-2);
    }

    return hexValue;
  }

  /**
   * @param {*} hex String['hexadecimal']
   * 
   * ex: string = '';
   *     nextIndex = 0;
   * 
   *     if (nextIndex == 0 < hex.length == 2) while continue
   *     else while break
   * 
   *     while(nextIndex < hex.length)
   *       if (nextIndex + 2 < hex.length)
   *         string += String.fromCharCode(parseInt(hex.substr(nextIndex, 2), 16));
   * 
   *         hex = '6162';
   *         case 1 (if)  : hex.substr(0, 2) return '61';
   *         case 1 (if)  : parseInt(hex.substr(0, 2), 16) return 97;
   *         case 1 (if)  : String.fromCharCode(97) return 'a';
   * 
   *         case 2 (else): hex.substr(2) return '62';
   *         case 2 (else): parseInt(hex.substr(0, 2), 16) return 98;
   *         case 2 (else): String.fromCharCode(98) return 'b';
   *  
   * return string; ["ab"];
   */
  hexToString(hex = '') {
    let string = '';
    let nextIndex = 0; 

    while(nextIndex < hex.length) {
      if (nextIndex + 2 < hex.length)  string += String.fromCharCode(parseInt(hex.substr(nextIndex, 2), 16));
      else string += String.fromCharCode(parseInt(hex.substr(nextIndex), 16));
      nextIndex += 2;
    }

    return string;
  }

  /**
   * @param {*} binary ArrayBuffer() { Int8Array, Int16Array, Int32Array, Uint8Array }
   * 
   * Obs: converte o binario para String
   *      btoa -> converte para base64
   * 
   * ex: let string = '';
   *     let buffer = new Uint8Array([119, 110]);
   * 
   *     for (let x of buffer) string += String.fromCharCode(x);
   *     console.log(string);
   *     >> "wn"
   * 
   *     console.log(btoa(string));
   *     >> "d24="
   */
  arrayBufferToBase64String(binary = new ArrayBuffer()) {
    let byteArray = new Uint8Array(binary);
    let binaryString = '';
    for (let byte of byteArray) binaryString += String.fromCharCode(byte);
    return btoa(binaryString);
  }

  /**
   * @param {*} value 
   * 
   * ex: binaryString = atob(value); obtem stringbinaria do base64
   *     bytes = new Uint8Array(binaryString.length); return [0,0,0,...]
   * 
   *     for (let index in binaryString) {
   *       bin.
   *       bin.charCodeAt(0);
   * 
   *       bytes[index] = binaryString.charCodeAt(index);
   *     }
   * 
   * return new ArrayBuffer();
   */
  base64StringToArrayBuffer(value = '') {
    let binaryString = atob(value);
    let bytes = new Uint8Array(binaryString.length);

    for (let index in binaryString) {
      bytes[index] = binaryString.charCodeAt(index);
    }

    return bytes.buffer;
  }

  /**
   * @param {*} binary ArrayBuffer() { Int8Array, Int16Array, Int32Array, Uint8Array }
   * @param {*} label [ RSA PUBLIC KEY | RSA PRIVATE KEY ]
   * 
   * return `
   *   -----BEGIN [RSA PUBLIC KEY | RSA PRIVATE KEY]-----
   *   ...contents
   *   -----END [RSA PUBLIC KEY | RSA PRIVATE KEY]-----
   * `
   */
  binaryToPem(binary = new ArrayBuffer(), label = 'RSA PUBLIC KEY') {
    let keyBase64 = this.arrayBufferToBase64String(binary);
    let nextIndex = 0;

    let pemCert = `-----BEGIN ${label}-----\r\n`;
    while(nextIndex < keyBase64.length) {
      let nextLineOrEnd = nextIndex + 64 < keyBase64.length;
      if (nextLineOrEnd) pemCert += `${keyBase64.substr(nextIndex, 64)}\r\n`;
      else pemCert += `${keyBase64.substr(nextIndex)}\r\n`;
      nextIndex += 64;
    }
    pemCert += `-----END ${label}-----\r\n`;
    return pemCert;
  }

  /**
   * @param {*} pem String
   * 
   * ex: lines = pem.split(\n); return [...];
   *     encoded = '';
   * 
   *     for (let line of lines) {
   *       if (line.trim().length > 0) se não é vazio
   *       if (line.indexOf('-BEGIN RSA PRIVATE KEY-) < 0) se não tiver
   *       if (line.indexOf('-BEGIN RSA PUBLIC KEY-) < 0) se não tiver 
   *       if (line.indexOf('-END RSA PRIVATE KEY-) < 0) se não tiver
   *       if (line.indexOf('-END RSA PUBLIC KEY-) < 0) se não tiver
   *     }
   * 
   * return new ArrayBuffer();
   */
  pemToBinary(pem = '') {
    let lines = pem.split('\n');
    let encoded = '';
    for(let line of lines) {
      if (
        line.trim().length > 0 &&
        line.indexOf('-BEGIN RSA PRIVATE KEY-') < 0 && 
        line.indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
        line.indexOf('-END RSA PRIVATE KEY-') < 0 &&
        line.indexOf('-END RSA PUBLIC KEY-') < 0
      ) {
        encoded += line.trim();
      }
    }

    return this.base64StringToArrayBuffer(encoded);
  }

  /**
   * Algorithm      = 'RSA-OAEP'
   * hash           = 'SHA-256'
   * modulusLength  = 2048
   * publicExponent = new Uint8Array([1,0,1])
   * ivLen          = 16
   * 
   * obs: publicKey  [encrypt]
   *      privateKey [decrypt]
   * 
   * SET secret.app.privateKey = new ArrayBuffer()
   * SET secret.app.publicKey = new ArrayBuffer()
   * 
   * return void;
   */
  async generateKeys() {
    try {
      let { publicKey, privateKey } = await this.window.crypto.subtle.generateKey({
        name: this.keyAlgorithm,
        modulusLength: this.modulusLength,
        publicExponent: this.publicExponent,
        hash: this.hashAlgorithm
      }, true, ['encrypt','decrypt']);

      this.secret.app.privateKey = privateKey;
      this.secret.app.publicKey = publicKey;
    } catch (error) {
      console.error("WEB CRYPTO API: is not supported");
      throw error;
    }
  }

  /**
   * return `
   *   -----BEGIN [RSA PUBLIC KEY | RSA PRIVATE KEY]-----
   *   ...contents
   *   -----END [RSA PUBLIC KEY | RSA PRIVATE KEY]-----
   */
  async exportPublicKey() {
    if (!this.secret.app.publicKey) await this.generateKeys();

    try {
      let binary = await this.window.crypto.subtle.exportKey('spki', this.secret.app.publicKey);
      return this.binaryToPem(binary);
    } catch (error) {
      console.error("FAILURE: To export public key");
      throw error;
    }
  }

  /**
   * @param {*} pem String
   * 
   * importa chave publica do servidor
   * 
   * return void
   */
  async importPublicKey(pem = '') {
    try {
      this.secret.server.publicKey = await this.window.crypto.subtle.importKey('spki', this.pemToBinary(pem), {
        name: this.keyAlgorithm,
        hash: this.hashAlgorithm
      }, false, ['encrypt']);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @param {*} data String() || ''
   * 
   * hash = 'SHA-256'
   * 
   * return String[hexadecimal]
   */
  async hash(data = '') {
    let arrayByffer = this.textToArrayBuffer(data);
    let hashable = await this.window.crypto.subtle.digest(this.hashAlgorithm, arrayByffer);
    return this.arrayBufferToHex(hashable);
  }

  /**
   * @param {*} value 
   * 
   * return String['encrypt']: base64
   */
  async encrypt(value = '') {
    let vector = this.getIv();

    let encryptBuffer = await this.window.crypto.subtle.encrypt({
      name: this.keyAlgorithm,
      iv: vector
    }, this.secret.server.publicKey, this.textToArrayBuffer(value));

    return this.arrayBufferToBase64String(encryptBuffer);
  }

  /**
   * @param {*} value 
   * 
   * return String['decrypt']: 'utf-8'
   */
  async decrypt(value = '') {
    let decryptBuffer = null, count = 0;
    let valueBuffer = this.base64StringToArrayBuffer(value);

    while(count < 10) {
      try {
        let vector = this.secret.ivs[count];
    
        decryptBuffer = await this.window.crypto.subtle.decrypt({
          name: this.keyAlgorithm,
          iv: vector
        }, this.secret.app.privateKey, valueBuffer);

        break;
      } catch (error) { }
      count++;
    }

    if (decryptBuffer) {
      return this.arrayBufferToText(decryptBuffer);
    }
    else {
      throw 'failure in decrypt data';
    }
  }

  async importIvs(ivs = []) {
    let ivsBytes = [];

    for(let iv of ivs) {
      let bytes = new Uint8Array(this.ivLen);

      for(let index in iv) {
        index = parseInt(index);

        bytes[index] = iv[index];
      }

      ivsBytes.push(bytes);
    }

    this.secret.ivs = ivsBytes;
  }

  async sync(data = { build: false }) {
    let { status, code, message, result } = await this.request({
      url: '/sync',
      method: 'POST',
      data: Object.assign({ }, 
      {
        pub: await this.exportPublicKey()
      },
      data
      )
    });

    if (status == 'error') {
      throw message;
    }

    await this.importIvs(result.ivs);
    await this.importPublicKey(result.pub);
  }
}

export default AppCrypto