const Message = require('./Message');

module.exports = class Round {
  constructor() {
    this.topic = '';
    this._messages = [];
    // Player.id -> anonymous name
    this._anonPlayerNames = new Map();
    // Player.id -> Player.id
    this._votes = new Map();
  }

  get playerNames() {
    return Array.from(this._anonPlayerNames.values());
  }

  get messages() {
    return this._messages;
  }

  get votes() {
    return Object.fromEntries(this._votes);
  }

  addPlayer(playerId, anonName) {
    this._anonPlayerNames.set(playerId, anonName);
  }

  addMessage(playerId, message) {
    const playerName = this._anonPlayerNames.get(playerId);
    if (!playerName) throw new Error(`No anonymised player found for playerId '${playerId}'`);
    this._messages.push(new Message(playerName, message));
  }

  setVote(playerId, anonPlayerName) {
    let targetId = null;
    for (const [id, name] of this._anonPlayerNames.entries()) {
      if (anonPlayerName === name) {
        targetId = id;
      }
    }
    if (!targetId) throw new Error(`No player found with anonymouse name '${anonPlayerName}'.`)
    this._votes.set(playerId, targetId)
  }

  serializeForClient() {
    return {
      topic: this.topic,
      playerNames: this.playerNames,
      messages: this.messages,
      votes: this.votes
    };
  }
}
