const uuid = require('uuid');
const EventEmitter = require('../lib/EventEmitter');
const generateName = require('../lib/NameProvider');
const GPT2Bot = require('../lib/bots/GPT2Bot');
const Player = require('./Player');
const Round = require('./Round');
const { BotEvent } = require('../lib/bots/BaseBot');
const WikipediaProvider = require('../lib/topic-providers/WikipediaProvider');
const { BOT_NAME,BOT_AVATAR } = require('../constants');
const { PreconditionNotSatisfied } = require('../errors');
const { Timer, TimerEvent } = require('../lib/Timer');

const RoomState = {
  Lobby: 'lobby',
  Prepare: 'prepare',
  Chat: 'chat',
  Vote: 'vote',
  Reveal: 'reveal'
};

const RoomEvent = {
  StateChange: 'state-change',
};

const DEFAULT_ROOM_OPTIONS = {
  rounds: 1,
  prepareTime: 10,
  chatTime: 60 * 2,
  voteTime: 60 * 3,
};

class Room extends EventEmitter {
  constructor() {
    super();
    this._emitterContext = this;
    this.id = uuid.v4();
    this.round = 0;
    this.host = null;
    this._state = RoomState.Lobby;
    // Player.id -> Player
    this._players = new Map();
    this._rounds = [];
    this._options = { ...DEFAULT_ROOM_OPTIONS };
    this._timer = new Timer(1000);
    this._timer.on(TimerEvent.Tick, () => {
      this.emit(RoomEvent.StateChange);
    }).on(TimerEvent.End, () => {
      this.nextState();
    });
    this._bot = new GPT2Bot();
    this._botPlayer = new Player(uuid.v4(), { name: BOT_NAME, avatar: BOT_AVATAR });
    this._bot.on(BotEvent.Message, (message) => {
      this.addMessage(this._botPlayer.id, message);
      this.emit(RoomEvent.StateChange);
    });
    this._bot.on(BotEvent.Error, (e) => this.emit(RoomEvent.Error, e));
    this._topicProviders = [
      new WikipediaProvider,
    ];
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
      timerDuration: this._timer.durationMS / 1000,
      timerRemaining: this._timer.remainingMS / 1000,
      round: this.round,
      host: this.host ? this.host.id : null,
      players: this.players,
      rounds: this.rounds.map((r) => r.serializeForClient()),
      options: this._options,
    };
  }

  setOptions(options) {
    if (this.state !== RoomState.Lobby) throw new Error('Room options can only be set while in the lobby.');
    const optionKeys = Object.keys(DEFAULT_ROOM_OPTIONS);
    Object.keys(options).forEach((k) => {
      if (!optionKeys.includes(k)) {
        throw new Error(`Invalid option: ${k}`);
      }
    });
    // TODO: add validation
    this._options = {
      ...this._options,
      ...options,
    };
  }

  async nextState() {
    if (this.state === RoomState.Lobby) {
      if (this._players.size < 2) throw new PreconditionNotSatisfied('At least 2 players required.');
      const round = await this.initNewRound();
      this._rounds.push(round);
      this._state = RoomState.Prepare;
      this._timer.start(this._options.prepareTime * 1000);
      this.emit(RoomEvent.StateChange);
    } else if (this.state === RoomState.Prepare) {
      this._state = RoomState.Chat;
      this.emit(RoomEvent.StateChange);
      this._bot.start();
      this._timer.start(this._options.chatTime * 1000);
    } else if (this.state === RoomState.Chat) {
      this._state = RoomState.Vote;
      this.emit(RoomEvent.StateChange);
      this._bot.stop();
      this._timer.start(this._options.voteTime * 1000);
    } else if (this.state === RoomState.Vote) {
      this._state = RoomState.Reveal;
      this.emit(RoomEvent.StateChange);
    } else if (this.state === RoomState.Reveal) {
      if (this.round < this._options.rounds - 1) {
        const round = await this.initNewRound();
        this._rounds.push(round);
        this.round++;
        this._state = RoomState.Prepare;
        this._timer.start(this._options.prepareTime * 1000);
        this.emit(RoomEvent.StateChange);
      } else {
        this._state = RoomState.Lobby;
        this.reset();
        this.emit(RoomEvent.StateChange);
      }
    }
  }

  async initNewRound() {
    const round = new Round();
    round.topic = await this.generateTopic();
    this._bot.appendContext(round.topic);
    round.addPlayer(this._botPlayer.id, generateName(round.playerNames));
    this._players.forEach((p) => {
      if (!p.isSpectator) {
        round.addPlayer(p.id, generateName(round.playerNames));
      }
    });
    return round;
  }

  async generateTopic() {
    const provider = this._topicProviders[Math.floor(this._topicProviders.length * Math.random())];
    return provider.provide();
  }

  reset() {
    this._state = RoomState.Lobby;
    this._round = 0;
    this._rounds = [];
    this._stateTimeout = null;
    this._bot.stop();
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
    this._bot.appendContext(message);
  }
}

module.exports = {
  Room,
  RoomState,
  RoomEvent,
};
