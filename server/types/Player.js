const { DEFAULT_PLAYER_NAME } = require('../constants');
const avatarGenerator = require('../lib/avatar-generator');

module.exports = class Player {
  constructor(id, options = {}) {
    this.id = id;
    this.avatar = options.avatar || avatarGenerator();
    this.name = options.name || DEFAULT_PLAYER_NAME;
    this.score = options.score || 0;
    this.isSpectator = options.isSpectator || false;
    this.isReady = options.isReady || false;
  }

  reset() {
    this.score = 0;
    this.isReady = false;
    this.isSpectator = false;
  }
}
