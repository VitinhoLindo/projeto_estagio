import MyCrypto from './MyCrypto'
import Axios from 'axios'

class MyRequestOption {
  constructor() {
    this.url = '';
    this.method = '';
    this.params = {};
    this.data = {};
    this.headers = {};
  }
}

class ResponseServer {
  constructor(data) {
    this.message = data.message;
    this.code = data.code;
    this.result = data.result || {};
    this.status = data.status;
  }

  static stance(data) {
    return new ResponseServer(data);
  }
}

class MyRequest extends MyCrypto {
  constructor() {
    super();
    this.protocol = 'http';
    this.domain   = '10.0.0.108';
    this.port     = '80'
    this.path     = `${this.protocol}://${this.domain}:${this.port}`;
  }

  defaultHeader(headers = {}) {
    for(let key in this.defaultHeaders) {
      if (!headers[key]) 
        headers[key] = this.defaultHeaders[key];
    }

    return headers;
  }


  async request(option = new MyRequestOption) {
    try {
      option.headers = this.defaultHeader(option.headers);

      let { data } = await Axios({
        url: this.path + option.url,
        method: option.method || 'GET',
        params: option.params || {},
        data: option.data || {}
      });

      return ResponseServer.stance(data);
    } catch (error) {
      console.error(error);
      return ResponseServer.stance({
        code: 400,
        message: error,
        status: 'error',
        result: {}
      });
    }
  }
}

export default MyRequest;