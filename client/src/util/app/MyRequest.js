import MyCrypto from './MyCrypto'
import Axios from 'axios'

class MyRequestOption {
  constructor() {
    this.url = '';
    this.method = '';
    this.params = {};
    this.data = {};
    this.headers = {};
    this.encrypt = false;
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
  }

  defaultHeader(headers = {}) {
    for(let key in this.defaultHeaders) {
      if (!headers[key]) 
        headers[key] = this.defaultHeaders[key];
    }

    return headers;
  }

  async params(params = {}, encrypt = false) {
    let data = Object.assign({}, params);

    if (encrypt) {
      data = await this.encrytOrDecrypt(data, 'encrypt');
    }

    return data;
  }

  async data(data = {}, encrypt = false) {
    let body = Object.assign({}, data);

    if (encrypt) {
      body = await this.encrytOrDecrypt(body, 'encrypt');
    }

    return body;
  }

  async request(option = new MyRequestOption) {
    try {
      option.headers = this.defaultHeader(option.headers);

      let params = await this.params(option.params || {}, option.encrypt);
      let body   = await this.data(option.data || {}, option.encrypt);

      let { data } = await Axios({
        url: option.url,
        method: option.method || 'GET',
        params: params || {},
        data: body || {}
      });

      if (data.result.expiredCrypto) {
        await this.sync({ build: true });

        if (!option.count) {
          option.count = 1;
        }
        else if (option.count == 5) {
          throw 'error in request'
        }
        else {
          option.count += 1;
        }

        await this.sleep(1);
        return await this.request(option);
      }

      if (option.encrypt) {
        data.result = await this.encrytOrDecrypt(data.result, 'decrypt');
      }

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