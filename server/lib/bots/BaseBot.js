const EventEmitter = require('../EventEmitter');

const BotState = {
  Idle: 0,
  Chatting: 1,
};

const BotEvent = {
  Error: 'error',
  Message: 'message',
};

class BaseBot extends EventEmitter {
  constructor() {
    super();
    this._emitterContext = this;
    this._state = BotState.Idle;
    this._context = '';
  }

  get state() {
    return this._state;
  }

  start() {
    throw new Error('Method not implemented.');
  }

  stop() {
    throw new Error('Method not implemented.');
  }

  appendContext(newContext) {
    this._context += `\n${newContext}`;
  }

  clearContext() {
    this._context = '';
  }
}

module.exports = {
  BaseBot,
  BotState,
  BotEvent,
};
