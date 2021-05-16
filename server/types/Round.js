const Message = require('./Message');

module.exports = class Round {
  constructor() {
    this.topic = '';
    this._messages = [];
  }

  get messages() {
    return this._messages;
  }

  addMessage(player, message) {
    this._messages.push(new Message(player, message));
  }

  serializeForClient() {
    return {
      topic: this.topic,
      messages: this.messages,
    };
  }
}
