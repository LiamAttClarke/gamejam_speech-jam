const Message = require('./Message');

module.exports = class Round {
  constructor() {
    this.seed = '';
    this._messages = [];
    // Player.id -> anonymous name
    this._anonPlayerNames = new Map();
    // Player.id -> Player.id
    this._imposterVotes = new Map();
  }

  get playerNames() {
    return Array.from(this._anonPlayerNames.values());
  }

  get messages() {
    return this._messages;
  }

  get imposterVotes() {
    return Object.fromEntries(this._imposterVotes);
  }

  addPlayer(playerId, anonName) {
    this._anonPlayerNames.set(playerId, anonName);
  }

  addMessage(playerId, message) {
    const playerName = this._anonPlayerNames.get(playerId);
    if (!playerName) throw new Error(`No anonymised player found for playerId '${playerId}'`);
    this._messages.push(new Message(playerName, message));
  }

  setImposterVote(playerId, anonPlayerName) {
    let targetId = null;
    for (const [id, name] of this._anonPlayerNames.entries()) {
      if (anonPlayerName === name) {
        targetId = id;
      }
    }
    if (!targetId) throw new Error(`No player found with anonymouse name '${anonPlayerName}'.`)
    this._imposterVotes.set(playerId, targetId)
  }

  serializeForClient() {
    return {
      seed: this.seed,
      playerNames: this.playerNames,
      messages: this.messages,
      imposterVotes: this.imposterVotes
    };
  }
}
