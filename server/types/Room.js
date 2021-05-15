const { v4: uuid } = require('uuid');
const Player = require('./Player');
const Message = require('./Message');

const RoomState = {
  Lobby: 'lobby',
  Prepare: 'prepare',
  Chat: 'chat',
  Vote: 'vote',
  Reveal: 'reveal'
};

class Room {
  constructor() {
    this.id = uuid();
    this.round = 0;
    this.host = null;
    this._state = RoomState.Lobby;
    // Player.id -> Player
    this._players = new Map();
    this._messages = [];
    this._options = {
      rounds: 3,
      prepareTime: 30,
      votingTime: 5 * 60,
    };
  }

  get state() {
    return this._state;
  }

  get players() {
    return Array.from(this._players.values());
  }

  get messages() {
    return this._messages;
  }

  serialize() {
    return {
      id: this.id,
      state: this.state,
      round: this.round,
      host: this.host ? this.host.id : null,
      players: this.players,
      messages: this.message,
      options: this._options,
    };
  }

  setOptions(options) {
    if (this.state !== RoomState.Lobby) throw new Error('Room options can only be set while in the lobby.');
    this._options = {
      ...this._options,
      ...options,
    };
  }

  reset() {
    this._state = RoomState.Lobby;
    this._round = 0;
    this._messages = [];
    this.players.forEach((p) => p.reset());
  }

  playerWithName(name) {
    return this.players.find((p) => p.name === name);
  }

  addPlayer(player) {
    if (!(player instanceof Player)) throw new Error(`Room.addPlayer expects an instance of Player. Got: ${player}`);
    if (!this._players.size) {
      this.host = player;
    }
    this._players.set(player.id, player);
  }

  removePlayer(playerId) {
    if (typeof playerId !== 'string') throw new Error(`Room.removePlayer expects a string (Player.id). Got: ${playerId}`);
    this._players.delete(playerId);
    if (this.host && this.host.id === playerId) {
      if (this.players.length) {
        this.host = this.players[0];
      } else {
        this.reset();
      }
    }
  }

  setPlayerReady(playerId, isReady) {
    const player = this._players.get(playerId);
    if (player) {
      player.isReady = isReady;
    } else {
      throw new Error(`Player '${playerId}' not found.`);
    }
  }

  addPoints(playerId, points) {
    const player = this._players.get(playerId);
    if (player) {
      player.score += points;
    } else {
      throw new Error(`Player '${playerId}' not found.`);
    }
  }

  addMessage(message) {
    if (!(message instanceof Message)) throw new Error(`Room.addMessage expects an instance of Message. Got: ${message}`);
    this.messages.push(message);
  }
}

module.exports = {
  Room,
  RoomState,
};
