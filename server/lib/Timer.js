const EventEmitter = require("./EventEmitter");

const TimerEvent = {
  Start: 'start',
  Cancel: 'cancel',
  End: 'end',
  Tick: 'tick',
};

class Timer extends EventEmitter {
  constructor(tickRateMS = 100) {
    super();
    this._emitterContext = this;
    this._tickRateMS = tickRateMS;
    this._durationMS = 0;
    this._startTime = 0;
    this._timeout = null;
    this._interval = null;
  }

  get durationMS() {
    return this._durationMS;
  }

  get remainingMS() {
    return Math.max((this._startTime + this._durationMS) - this.timestamp(), 0);
  }

  timestamp() {
    return (new Date()).getTime();
  }

  start(durationMS) {
    this._durationMS = durationMS;
    this._startTime = this.timestamp();
    this._timeout = setTimeout(this._onEnd.bind(this), this._durationMS);
    this._interval = setInterval(this._onTick.bind(this), this._tickRateMS);
    this.emit(TimerEvent.Start);
    return this;
  }

  cancel() {
    this._reset();
    this.emit(TimerEvent.Cancel);
    return this;
  }

  _onTick() {
    this.emit(TimerEvent.Tick);
  }

  _onEnd() {
    this._reset();
    this.emit(TimerEvent.End);
  }

  _reset() {
    this._startTime = 0;
    clearTimeout(this._timeout);
    clearInterval(this._interval);
    return this;
  }
}

module.exports = {
  Timer,
  TimerEvent,
};
