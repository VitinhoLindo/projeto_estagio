const { parse } = require('qs');
const Directory = require('./dir');

class MtDate {
  date   = new Date();

  year         = 0;
  month        = 0;
  day          = 0;
  hour         = 0;
  minute       = 0;
  seconds      = 0;
  milliseconds = 0;

  constructor(date = new Date()) {
    this.date = date;

    this.setDate();
  }

  setDate() {
    this.year         = this.date.getFullYear();
    this.month        = this.date.getMonth() + 1;
    this.day          = this.date.getDate();
    this.hour         = this.date.getHours();
    this.minute       = this.date.getMinutes();
    this.seconds      = this.date.getSeconds();
    this.milliseconds = this.date.getMilliseconds();
  }

  addDays(value = 0) {
    if (!value) return this;
    if (!parseInt(value)) return this;

    this.date.setDate(this.date + parseInt(value));
    return this;
  }

  decreaseHour(value = 0) {
    if (!value) return this;
    if (!parseInt(value)) return this;

    this.date.setHours(this.hour + parseInt(value));
    return this;    
  }

  addHours(value = 0) {
    if (!value) return this;
    if (!parseInt(value)) return this;

    this.date.setHours(this.hour + parseInt(value));
    return this;
  }

  addMinutes(value = 0) {
    if (!value) return this;
    if (!parseInt(value)) return this;

    this.date.setMinutes(this.minute + parseInt(value));
    return this;
  }

  get() {
    return this.date;
  }

  now() {
    this.date = new Date();
    return this.date;
  }

  dateObject() {
    return {
      date: {
        year: this.year,
        month: this.month,
        day: this.day,
      },
      time: {
        hour: this.hour,
        minute: this.minute,
        seconds: this.seconds,
        milliseconds: this.milliseconds,
      },
      currentDate: `${this.year}-${this.month}-${this.day}`,
      currentDateObject: this.get()
    };
  }
}


class Util extends Directory {
  constructor() { super(); }

  getMtDate(date = new Date()) {
    return new MtDate(date);
  }
}

module.exports = Util;