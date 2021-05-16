const { v4: uuid } = require('uuid');
const EventEmitter = require('../lib/EventEmitter');
const Player = require('./Player');
const Round = require('./Round');

const RoomState = {
  Lobby: 'lobby',
  Prepare: 'prepare',
  Chat: 'chat',
  Vote: 'vote',
  Reveal: 'reveal'
};

const RoomEvent = {
  StateChange: 'state-change',
}

class Room extends EventEmitter {
  constructor() {
    super();
    this._emitterContext = this;
    this.id = uuid();
    this.round = 0;
    this.host = null;
    this._state = RoomState.Lobby;
    // Player.id -> Player
    this._players = new Map();
    this._rounds = [];
    this._options = {
      rounds: 3,
      prepareTime: 3,
      chatTime: 10,
      votingTime: 10,
    };
    this._stateTimeout = null;
  }

  get state() {
    return this._state;
  }

  get players() {
    return Array.from(this._players.values());
  }

  get rounds() {
    return this._rounds;
  }

  get currentRound() {
    return this._rounds[this.round];
  }

  get options () {
    return this._options;
  }

  serializeForClient() {
    return {
      id: this.id,
      state: this.state,
      round: this.round,
      host: this.host ? this.host.id : null,
      players: this.players,
      rounds: this.rounds.map((r) => r.serializeForClient()),
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

  nextState() {
    if (this.state === RoomState.Lobby) {
      if (this._players.size < 2) throw new Error('At least 2 players required.');
      this._rounds.push(this.initNewRound());
      this._state = RoomState.Prepare;
      this._stateTimeout = setTimeout(this.nextState.bind(this), this._options.prepareTime * 1000);
    } else if (this.state === RoomState.Prepare) {
      clearTimeout(this._stateTimeout);
      this._state = RoomState.Chat;
      this._stateTimeout = setTimeout(this.nextState.bind(this), this._options.chatTime * 1000);
    } else if (this.state === RoomState.Chat) {
      clearTimeout(this._stateTimeout);
      this._state = RoomState.Vote;
      this._stateTimeout = setTimeout(this.nextState.bind(this), this._options.votingTime * 1000);
    } else if (this.state === RoomState.Vote) {
      clearTimeout(this._stateTimeout);
      this._state = RoomState.Reveal;
    } else if (this.state === RoomState.Reveal) {
      if (this.round < this._options.rounds - 1) {
        this._rounds.push(this.initNewRound());
        this.round++;
        this._state = RoomState.Prepare;
        this._stateTimeout = setTimeout(this.nextState.bind(this), this._options.prepareTime * 1000);
      } else {
        this._state = RoomState.Lobby;
        this.reset();
      }
    }
    this.emit(RoomEvent.StateChange);
  }

  initNewRound() {
    const round = new Round();
    round.seed = this.generateChatSeed();
    this._players.forEach((p) => {
      if (!p.isSpectator) {
        round.addPlayer(p.id, this.generateAnonPlayerName());
      }
    });
    return round;
  }

  generateAnonPlayerName() {
    return `anon_${Math.random()}`;
  }

  generateChatSeed() {
    return 'hello world';
  }

  reset() {
    this._state = RoomState.Lobby;
    this._round = 0;
    this._rounds = [];
    this._stateTimeout = null;
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

  addMessage(playerId, message) {
    this.currentRound.addMessage(playerId, message);
  }
}

module.exports = {
  Room,
  RoomState,
  RoomEvent,
};
