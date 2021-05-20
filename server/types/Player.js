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
    this.score = options.score || 0;
    this.isReady = options.isReady || false;
    this.vote = null;
  }

  reset() {
    this.score = 0;
    this.isReady = false;
  }
}

module.exports = {
  Player,
  PlayerType,
};
