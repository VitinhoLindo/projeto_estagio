class Variables {
  constructor() {
    this.secret = {
      app: {
        privateKey: '',
        publicKey: ''
      },
      server: {
        publicKey: '',
        datePublic: new Date()
      },
      ivs: []
    }

    this.keyAlgorithm = 'RSA-OAEP';
    this.hashAlgorithm = 'SHA-256';
    this.modulusLength = 2048;
    this.publicExponent = new Uint8Array([1, 0, 1]);
    this.ivLen = 16;

    this.cache = {}

    this.window = window;

    this.language = {
      lang: '',
      labels: {}
    };
    this.languages = [];


    this.paths = {
      language: {
        path: '/translate',
        method: 'get'
      }
    }
    this.defaultHeaders = {}
  }
}

export default Variables;