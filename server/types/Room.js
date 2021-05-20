const uuid = require('uuid');
const EventEmitter = require('../lib/EventEmitter');
const generateName = require('../lib/NameProvider');
const GPT2Bot = require('../lib/bots/GPT2Bot');
const { Player, PlayerType } = require('./Player');
const Round = require('./Round');
const { BotEvent } = require('../lib/bots/BaseBot');
const { BOT_AVATAR, POINTS_CORRECT_GUESS, POINTS_TRICKING_PLAYER } = require('../constants');
const { PreconditionNotSatisfied } = require('../errors');
const { Timer, TimerEvent } = require('../lib/Timer');
const { getRandomElement } = require('../lib/utils');
const Topics = require('../topics');
const RobotNames = require('../robot-names');

const RoomState = {
  Lobby: 'lobby',
  Prepare: 'prepare',
  Chat: 'chat',
  Vote: 'vote',
  Reveal: 'reveal',
  End: 'end',
};

const RoomEvent = {
  StateChange: 'state-change',
};

// const DEFAULT_ROOM_OPTIONS = {
//   rounds: 1,
//   prepareTime: 10,
//   chatTime: 60 * 2,
//   voteTime: 60 * 3,
// };
const DEFAULT_ROOM_OPTIONS = {
  rounds: 1,
  prepareTime: 1,
  chatTime: 1,
  voteTime: 10,
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
    this._timer
      .on(TimerEvent.Tick, () => {
        this.emit(RoomEvent.StateChange);
      })
      .on(TimerEvent.End, () => {
        this.nextState();
      });
    this._bot = new GPT2Bot();
    this._botPlayer = new Player(uuid.v4(), {
      type: PlayerType.Bot,
      name: this.getBotName(),
      avatar: BOT_AVATAR,
      isReady: true,
    });
    this.addPlayer(this._botPlayer);
    this._bot.on(BotEvent.Message, (message) => {
      this.addMessage(this._botPlayer, message);
      this.emit(RoomEvent.StateChange);
    });
    this._bot.on(BotEvent.Error, (e) => this.emit(RoomEvent.Error, e));
  }

  get state() {
    return this._state;
  }

  get players() {
    return Array.from(this._players.values());
  }

  get activePlayerCount() {
    return this.players.filter((p) => p.type === PlayerType.Player).length;
  }

  get rounds() {
    return this._rounds;
  }

  get currentRound() {
    return this._rounds[this.round];
  }

  get options() {
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
      players: this.players.map((r) => r.serializeForClient()),
      botPlayer: this._botPlayer,
      rounds: this.rounds.map((r) => r.serializeForClient()),
      options: this._options,
    };
  }

  setOptions(options) {
    if (this.state !== RoomState.Lobby)
      throw new Error('Room options can only be set while in the lobby.');
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

  nextState() {
    if (this.state === RoomState.Lobby) {
      if (this._players.size < 2)
        throw new PreconditionNotSatisfied('At least 2 players required.');
      const round = this.initNewRound();
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
      this._awardRoundPoints();
      this.emit(RoomEvent.StateChange);
    } else if (this.state === RoomState.Reveal) {
      if (this.round < this._options.rounds - 1) {
        const round = this.initNewRound();
        this._rounds.push(round);
        this.round++;
        this._state = RoomState.Prepare;
        this._timer.start(this._options.prepareTime * 1000);
        this.emit(RoomEvent.StateChange);
      } else {
        this._state = RoomState.End;
        this.emit(RoomEvent.StateChange);
      }
    } else if (this.state === RoomState.End) {
      this._state = RoomState.Lobby;
      this.emit(RoomEvent.StateChange);
    }
  }

  initNewRound() {
    this._bot.clearContext();
    const round = new Round();
    round.topic = this.getTopic();
    this._bot.appendContext(round.topic);
    const assignedAnonNames = [];
    const botAnonName = generateName();
    assignedAnonNames.push(botAnonName);
    this._botPlayer.anonName = botAnonName;
    this.players.forEach((p) => {
      if (!p.type !== PlayerType.Spectator) {
        const anonName = generateName(assignedAnonNames);
        assignedAnonNames.push(anonName);
        p.anonName = anonName;
        p.vote = null;
      }
    });
    return round;
  }

  getTopic() {
    return getRandomElement(Topics);
  }

  getBotName() {
    return getRandomElement(RobotNames);
  }

  reset() {
    this._timer.cancel();
    this._state = RoomState.Lobby;
    this._round = 0;
    this._rounds = [];
    this._bot.stop();
    this._botPlayer.name = this.getBotName();
    this.players.forEach((p) => p.reset());
  }

  playerWithName(name) {
    return this.players.find((p) => p.name === name);
  }

  addPlayer(player) {
    if (!(player instanceof Player))
      throw new Error(`Room.addPlayer expects an instance of Player. Got: ${player}`);
    if (player.type === PlayerType.Player && !this.activePlayerCount) {
      this.host = player;
    }
    this._players.set(player.id, player);
  }

  removePlayer(playerId) {
    if (typeof playerId !== 'string')
      throw new Error(`Room.removePlayer expects a string (Player.id). Got: ${playerId}`);
    this._players.delete(playerId);
    if (this.host && this.host.id === playerId) {
      const nextHost = this.players.find((p) => p.type === PlayerType.Player);
      if (nextHost) {
        this.host = nextHost;
      } else {
        this.reset();
      }
    }
    if (this.state !== RoomState.Lobby && this.activePlayerCount < 2) {
      this.reset();
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

  addMessage(playerId, message) {
    this.currentRound.addMessage(playerId, message);
    this._bot.appendContext(message);
  }

  setVote(playerId, vottedPlayerId) {
    const player = this._players.get(playerId);
    if (player) {
      player.vote = vottedPlayerId;
    } else {
      throw new Error(`Player '${playerId}' not found.`);
    }
  }

  addPoints(playerId, points) {
    const player = this._players.get(playerId);
    if (player) {
      player.addPoints(points);
    } else {
      throw new Error(`Player '${playerId}' not found.`);
    }
  }

  _awardRoundPoints() {
    if (this._rounds.length) {
      const playerPoints = new Map();
      this._players.forEach((p) => playerPoints.set(p.id, 0));
      this._players.forEach((p) => {
        if (p.type !== PlayerType.Player) return;
        if (p.vote === this._botPlayer.id) {
          playerPoints.set(p.id, playerPoints.get(p.id) + POINTS_CORRECT_GUESS);
        } else if (this._players.has(p.vote)) {
          playerPoints.set(p.vote, playerPoints.get(p.vote) + POINTS_TRICKING_PLAYER);
        }
      });
      for (const [pid, score] of playerPoints.entries()) {
        const player = this._players.get(pid);
        if (player) {
          player.setRoundPoints(score);
        }
      }
    } else {
      throw new Error('No rounds started.');
    }
  }
}

module.exports = {
  Room,
  RoomState,
  RoomEvent,
};
