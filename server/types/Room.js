const { v4: uuid } = require('uuid');

module.exports = class Room {
    constructor() {
        this.id = uuid();
        this.round = 0;
        this.host = null;
        this._players = new Map();        
        this._scores = new Map();
    }

    get players() {
        return Array.from(this._players.values());
    }

    get scores() {
        return Array.from(this._scores.values());
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

    addPlayer(player) {
        if (!this._players.size) {
            this.host = player;
        }
        this._players.set(player.id, player);
        this._scores.set(player.id, 0);
    }

    removePlayer(playerId) {
        if (this.host.id === playerId) {
            this.host = null;
        }
        this._players.delete(playerId);
        this._scores.delete(playerId);
    }

    addPoints(playerId, points) {
        const currentScore = this._scores.get(playerId);
        this._scores.set(playerId, currentScore + points);
    }
}