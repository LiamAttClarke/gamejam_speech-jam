const { DEFAULT_PLAYER_NAME } = require("../constants");

module.exports = class Player {
  constructor(id, options = {}) {
    this.id = id;
    this.name = options.name || DEFAULT_PLAYER_NAME;
    this.isSpectator = 'isSpectator' in options ? options.isSpectator : false;
  }
}
