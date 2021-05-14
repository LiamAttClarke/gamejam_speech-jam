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
        // Player.id -> Score
        this._scores = new Map();
        this._messages = [];
    }

    get state() {
        return this._state;
    }

    get players() {
        return Array.from(this._players.values());
    }

    get scores() {
        return Object.fromEntries(this._scores);
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
            scores: this.scores,
            messages: this.message,        
        };
    }

    restart() {
        this._round = 0;
        this.resetScores();
    }

    resetScores() {
        this._scores.forEach((_, key) => {
            this._scores.set(key, 0);
        });
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
        this._scores.set(player.id, 0);
    }

    removePlayer(playerId) {
        if (typeof playerId !== 'string') throw new Error(`Room.removePlayer expects a string (Player.id). Got: ${playerId}`);
        if (this.host && this.host.id === playerId) {
            if (this.players.length) {
                this.host = this.players[0];
            } else {
                this.restart();
            }
        }
        this._players.delete(playerId);
        this._scores.delete(playerId);
    }

    addMessage(message) {
        if (!(message instanceof Message)) throw new Error(`Room.addMessage expects an instance of Message. Got: ${message}`);        
        this.messages.push(message);
    }

    addPoints(playerId, points) {
        const currentScore = this._scores.get(playerId);
        this._scores.set(playerId, currentScore + points);
    }
}

module.exports = {
    Room,
    RoomState,
};