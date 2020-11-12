class Variables {
  constructor() { 
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