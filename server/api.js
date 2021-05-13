const {
  DEFAULT_PLAYER_NAME,
} = require('./constants');
const Room = require('./types/Room');
const Player = require('./types/Player');

const room = new Room();

exports.onConnect = (socket) => {
  const player = new Player(socket.id, DEFAULT_PLAYER_NAME);  
  room.addPlayer(player);
  socket.join(room.id);

  log(player, 'connected');

  socket.on('disconnect', () => {
    room.removePlayer(player.id);
    log(player, 'disconnected');
  });
}

function log(player, message) {
  console.info(`Player ${player.id}(${player.name}): ${message}`);
}