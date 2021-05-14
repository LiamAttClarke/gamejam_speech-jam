const { Room, RoomState } = require('./types/Room');
const Player = require('./types/Player');
const Message = require('./types/Message');

const room = new Room();

const ServerMessage = {
  Error: 'error',  
  JoinedRoom: 'joined:room',
  AddPlayer: 'added:player',
  UpdatePlayer: 'updated:player',
  AddMessage: 'added:message',
};

const ClientMessage = {
  SetName: 'set:name',
  AddMessage: 'add:message',
};

const ErrorMessage = {
  InvalidPlayerName: 'Player name must be at least 1 character long.',
  PlayerNameTaken: 'A player with this name already exists in this room.',
  EmptyMessage: 'No message provided.',
  RoomNotReadyForMessage: 'Failed to add message, chatroom is not ready.',
  SpectatorNotPermitted: 'Spectators are not permitted to perform this action.',
};

exports.initSockets = (io) => {
  io.on('connect', (socket) => {
    const player = new Player(socket.id, {
      isSpectator: room.state !== RoomState.Lobby,
    });
    room.addPlayer(player);
    socket.join(room.id);
    socket.emit(ServerMessage.JoinedRoom, room.serialize());
    socket.to(room.id).emit(ServerMessage.AddPlayer, player);
    log(player, 'Connected');

    socket.on('disconnect', (reason) => {
      room.removePlayer(player.id);
      log(player, `Disconnected. Reason: ${reason}`);
    });

    socket.on(ClientMessage.SetName, (name) => {
      if (typeof username !== 'string' || !username) {
        socket.emit(ServerMessage.Error, ErrorMessage.InvalidPlayerName);
        return;
      }
      if (room.playerWithName(name)) {
        socket.emit(ServerMessage.Error, ErrorMessage.PlayerNameTaken);
        return;
      }
      player.name = name;
      socket.to(room.id).emit(ServerMessage.UpdatePlayer, player);
      log(player, `SetName: ${message}`);
    });

    socket.on(ClientMessage.AddMessage, (message) => {      
      if (room.state !== RoomState.Chat) {
        socket.emit(ServerMessage.Error, ErrorMessage.RoomNotReadyForMessage);
        return;
      }
      if (player.isSpectator) {
        socket.emit(ServerMessage.Error, ErrorMessage.SpectatorNotPermitted);
      }
      if (typeof username !== 'string' || !username) {
        socket.emit(ServerMessage.Error, ErrorMessage.EmptyMessage);
        return;
      }      
      room.addMessage(new Message(player.id, message));
      socket.to(room.id).emit(ServerMessage.AddMessage, message);
      log(player, `AddMessage: ${message}`);
    });
  });
}

function log(player, message) {
  console.info(`Player ${player.id}(${player.name}): ${message}`);
}