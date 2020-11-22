import MyRequest from './MyRequest'

class MyWindow extends MyRequest {
  constructor() { super(); }

  getOffSet() {
    let { innerWidth, innerHeight } = this.window;
    return { innerWidth, innerHeight };
  }

  sleep(time = 1) {
    time  = parseFloat(time) || 1;
    time *= 1000;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }
}

export default MyWindow;