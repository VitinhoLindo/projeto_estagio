import MyCrypto from './MyCrypto'

class MyRequestOption {
  constructor() {
    this.url = '';
    this.method = '';
    this.params = {};
    this.data = {};
    this.headers = {};
  }
}

class MyRequest extends MyCrypto {
  constructor() { super(); }

  defaultHeader(headers = {}) {
    for(let key in this.defaultHeaders) {

    }
  }


  async request(option = new MyRequestOption) {
  }
}

export default MyRequest;