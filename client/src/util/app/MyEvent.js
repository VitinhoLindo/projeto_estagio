import Variables from './Variables'

const listiners = {}

const error = async function (string, callback) {
  if (callback) callback(string, null);
  else console.error(string);
}

const success = async function (pid, callback) {
  if (callback) callback(null, pid);  
}

class MyEvent extends Variables {
  constructor() { super(); }

  async on(listen, func, callback) {
    if (typeof listen !== 'string') return error('function.on: variable listen is not string', callback);
    if (typeof func !== 'function') return error('function.on: variable listen is not function', callback);

    if (!listiners[listen]) listiners[listen] = { count: 1 };
    const pid = listiners[listen].count;
    listiners[listen].count++;
    listiners[listen][pid] = func;

    return success(pid, callback);
  }

  async emit(listen, ...args) {
    if (!listiners[listen]) return error(`function.emit: ${listen} is not defined`);

    for(let pid of listiners[listen]) {
      (async () => {
        try {
          listiners[listen][pid].apply(null, args);
        } catch (err) {
          error(err);
        }
      })();
    }
  }

  async removeListiner(listen, pid) {
    if (!listiners[listen]) return error(`function.removeListiner: listen '${listen}' is not defined`);
    if (!listiners[listen][pid]) return error(`function.removeListiner: pid '${pid}' is not defined`);

    delete listiners[listen][pid];
  }
}

export default MyEvent;