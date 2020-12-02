import Variables from './Variables'

var listiners = {}

const error = async function (string, callback) {
  if (callback) callback(string, null);
  else console.error(string);
}

const success = async function (pid, callback) {
  if (callback) callback(null, pid);  
}

class MyEvent extends Variables {
  constructor() { super(); }

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

  async on(listen, func, callback) {
    if (typeof listen !== 'string') return error('function.on: variable listen is not string', callback);
    if (typeof func !== 'function') return error('function.on: variable function is not function', callback);

    if (!listiners[listen]) listiners[listen] = { };

    let pid;

    do {
      pid = this.randomNumber(1, 999999);
    } while(listiners[listen][pid]);

    listiners[listen][pid] = func;
    return success(pid, callback);
  }

  async emit(listen, ...args) {
    if (!listiners[listen]) return error(`function.emit: ${listen} is not defined`);

    for(let pid in listiners[listen]) {
      try {
        listiners[listen][pid].apply(null, args);
      } catch (err) {
        error(err);
      }
    }
  }

  async removeListiner(listen, pid) {
    if (!listiners[listen]) return error(`function.removeListiner: listen '${listen}' is not defined`);
    if (!listiners[listen][pid]) return error(`function.removeListiner: pid '${pid}' is not defined`);

    delete listiners[listen][pid];
  }

  resize(event) {
    let { innerWidth, innerHeight } = this.window;
    this.emit('resize', { innerWidth, innerHeight });
  }
}

export default MyEvent;