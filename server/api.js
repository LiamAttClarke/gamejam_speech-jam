const { Room, RoomState } = require('./types/Room');
const Player = require('./types/Player');
const Message = require('./types/Message');

const room = new Room();

const ServerMessage = {
  Error: 'error',
  StateUpdate: 'update:state',
};

const ClientMessage = {
  SetRoomOptions: 'set:room-options',
  Reset: 'reset',
  SetName: 'set:name',
  SetReady: 'set:ready',
  AddMessage: 'add:message',
};

const ErrorMessage = {
  HostOnly: 'This action can only be performed by the room\'s host',
  LobbyOnly: 'This action can only be performed in the lobby.',
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
    const updatedRoomState = room.serialize();
    socket.join(room.id);
    io.in(room.id).emit(ServerMessage.StateUpdate, updatedRoomState);
    log(player, 'Connected');

    socket.on('disconnect', (reason) => {
      room.removePlayer(player.id);
      socket.to(room.id).emit(ServerMessage.StateUpdate, room.serialize());
      log(player, `Disconnected. Reason: ${reason}`);
    });

    // Host Controls

    socket.on(ClientMessage.Reset, () => {
      if (!room.host && room.host.id === player.id) {
        socket.emit(ServerMessage.Error, ErrorMessage.HostOnly);
        return;
      }
      room.reset();
      io.in(room.id).emit(ServerMessage.StateUpdate, room.serialize());
      log(player, `Reset`);
    });

    socket.on(ClientMessage.SetRoomOptions, (options) => {
      if (!room.host && room.host.id === player.id) {
        socket.emit(ServerMessage.Error, ErrorMessage.HostOnly);
        return;
      }
      if (room.state != RoomState.Lobby) {
        socket.emit(ServerMessage.Error, ErrorMessage.LobbyOnly);
        return;
      }
      room.setOptions(options);
      io.in(room.id).emit(ServerMessage.StateUpdate, room.serialize());
      log(player, `SetOptions: ${JSON.stringify(options)}`);
    });

    // Player Controls

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
      io.in(room.id).emit(ServerMessage.StateUpdate, room.serialize());
      log(player, `SetName: ${message}`);
    });

    socket.on(ClientMessage.SetReady, (isReady) => {
      if (room.state !== RoomState.Lobby) {
        socket.emit(ServerMessage.Error, ErrorMessage.LobbyOnly);
        return;
      }
      if (player.isSpectator) {
        socket.emit(ServerMessage.Error, ErrorMessage.SpectatorNotPermitted);
      }
      room.setPlayerReady(player.id, isReady);
      io.in(room.id).emit(ServerMessage.StateUpdate, room.serialize());
      log(player, `SetReady: ${isReady}`);
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
      io.in(room.id).emit(ServerMessage.StateUpdate, room.serialize());
      log(player, `AddMessage: ${message}`);
    });
  });
}

function log(player, message) {
  console.info(`Player ${player.id}(${player.name}): ${message}`);
}
