const { DEFAULT_PLAYER_NAME } = require('../constants');
const avatarGenerator = require('../lib/avatar-generator');

const PlayerType = {
  Player: 'player',
  Spectator: 'spectator',
  Bot: 'bot',
};

class Player {
  constructor(id, options = {}) {
    this.id = id;
    this.type = options.type || PlayerType.Player;
    this.avatar = options.avatar || avatarGenerator();
    this.name = options.name || DEFAULT_PLAYER_NAME;
    this.anonName = options.anonName || DEFAULT_PLAYER_NAME,
    this.isReady = options.isReady || false;
    this.vote = null;
    this._score = options.score || 0;
    this._scoreHistory = [];
  }

  get score() {
    return this._score;
  }

  get scoreHistory() {
    return this._scoreHistory;
  }

  serializeForClient() {
    return {
      id: this.id,
      type: this.type,
      avatar: this.avatar,
      name: this.name,
      anonName: this.anonName,
      isReady: this.isReady,
      vote: this.vote,
      score: this.score,
      scoreHistory: this.scoreHistory,
    };
  }

  reset() {
    this._score = 0;
    this._scoreHistory = [];
    this.isReady = this.type === PlayerType.Bot ? true : false;
  }

  setRoundPoints(points) {
    this._scoreHistory.push(points);
    this._score += points;
  }
}

module.exports = {
  Player,
  PlayerType,
};
