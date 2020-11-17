const BaseController = require('./MainController');

class SyncController extends BaseController {

  constructor(req, res) { super(req, res); }

  static estance() {
    return SyncController;
  }
  
  async get() {
    let cache = this.app.getCache(this.request.socket.remoteAddress);
    let res = { auth: true }


    if (!cache || !cache.cryptoGenerate) {
      res.auth = false;
    }

    return this.defaultResponseJSON({
      result: res
    });
  }

  //
  async post() {
    let all = this.all();
    let validator = this.Validator.make(all, { 
      pub: 'required|string' 
    }, { 
      pub: { 
        required: 'pub field is required', 
        string: 'pub type is string' 
      } 
    });

    if (validator.fails()) {
      return this.defaultResponseJSON(validator.modelResponse());
    }

    let cache = this.app.getCache(this.request.socket.remoteAddress);
    let pub = null, publicKey, privateKey; 

    if (cache && cache.cryptoGenerate) {
      if (!all.build) {
        return this.serverImportKeysAndSave(cache.server.priv, cache.server.pub, cache.app.pub, cache.cryptoGenerate, cache.ivs);
      }

      let { server } = cache;
      publicKey  = server.publicKey;
      privateKey = server.privateKey;
    }
    
    pub = this.app.pemToBinary(all.pub)
    pub = await this.app.importKey(pub);

    if (!publicKey && !privateKey) {
      let keys = await this.app.generateKeys();
      publicKey  = keys.publicKey;
      privateKey = keys.privateKey;
    }

    let ivs = [];
    for(let x = 0; x < 10; x++) {
      ivs.push(this.app.getIv());
    }

    return this.serverImportKeysAndSave(privateKey, publicKey, pub, new Date(), ivs);
  }

  async serverImportKeysAndSave(privateKey, publicKey, pub, date = new Date(), ivs = [new Uint8Array(16)]) {
    this.app.saveCache(this.request.socket.remoteAddress, {
      app: {
        pub: pub
      },
      server: {
        pub: publicKey,
        priv: privateKey
      },
      ivs: ivs,
      cryptoGenerate: date
    });

    publicKey = await this.app.exportKey(publicKey);
    publicKey = this.app.binaryToPem(publicKey);

    return this.defaultResponseJSON({
      result: {
        pub: publicKey,
        ivs,
        date
      }
    })
  }
}

module.exports = SyncController;