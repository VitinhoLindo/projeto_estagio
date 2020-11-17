import MyRequest from './MyRequest'

class MyWindow extends MyRequest {
  constructor() { super(); }

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