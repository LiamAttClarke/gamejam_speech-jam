const { Room, RoomState, RoomEvent } = require('./types/Room');
const Player = require('./types/Player');
const { DEFAULT_PLAYER_NAME } = require('./constants');
const { PreconditionNotSatisfied } = require('./errors');
const generateAvatar = require('./lib/avatar-generator');

const ServerMessage = {
  Error: 'error',
  StateUpdate: 'update:state',
};

const ClientMessage = {
  SetOptions: 'set:options',
  Continue: 'continue',
  Reset: 'reset',
  SetName: 'set:name',
  SetReady: 'set:ready',
  AddMessage: 'add:message',
  SetVote: 'set:vote',
};

const ErrorMessage = {
  HostOnly: "This action can only be performed by the room's host",
  LobbyOnly: 'This action can only be performed in the lobby.',
  ChatOnly: 'This action can only be performed in the Chat phase.',
  VoteOnly: 'This action can only be performed in the Vote phase.',
  InvalidPlayerName: 'Player name must be at least 1 character long.',
  PlayerNameTaken: 'A player with this name already exists in this room.',
  EmptyMessage: 'No message provided.',
  SpectatorNotPermitted: 'Spectators are not permitted to perform this action.',
  NoManualContinue: 'The host may not skip this step.',
};

let room = new Room();
let anonNameCounter = 0;

function resetRoom() {
  room = new Room();
  anonNameCounter = 0;
}

exports.initSockets = (io) => {
  room.on(RoomEvent.StateChange, () => {
    io.to(room.id).emit(ServerMessage.StateUpdate, room.serializeForClient());
  });

  io.on('connect', (socket) => {
    anonNameCounter++;
    const player = new Player(socket.id, {
      name: `${DEFAULT_PLAYER_NAME}${anonNameCounter}`,
      avatar: generateAvatar(room.players.map((p) => p.avatar)),
      isSpectator: room.state !== RoomState.Lobby,
    });
    room.addPlayer(player);
    const updatedRoomState = room.serializeForClient();
    socket.join(room.id);

    io.in(room.id).emit(ServerMessage.StateUpdate, updatedRoomState);
    logPlayer(player, 'Connected');

    socket.on('disconnect', (reason) => {
      room.removePlayer(player.id);
      if (!room.players.length) resetRoom();
      socket.to(room.id).emit(ServerMessage.StateUpdate, room.serializeForClient());
      logPlayer(player, `Disconnected. Reason: ${reason}`);
    });

    // Host Controls

    socket.on(ClientMessage.SetOptions, (options) => {
      if (!room.host && room.host.id === player.id) {
        socket.emit(ServerMessage.Error, ErrorMessage.HostOnly);
        return;
      }
      if (room.state != RoomState.Lobby) {
        socket.emit(ServerMessage.Error, ErrorMessage.LobbyOnly);
        return;
      }
      room.setOptions(options);
      io.in(room.id).emit(ServerMessage.StateUpdate, room.serializeForClient());
      logPlayer(player, `SetOptions: ${JSON.stringify(options)}`);
    });

    socket.on(ClientMessage.Continue, async () => {
      if (!room.host && room.host.id === player.id) {
        socket.emit(ServerMessage.Error, ErrorMessage.HostOnly);
        return;
      }
      if (![RoomState.Lobby, RoomState.Reveal].includes(room.state)) {
        socket.emit(ServerMessage.Error, ErrorMessage.NoManualContinue);
        return;
      }
      try {
        await room.nextState();
      } catch (e) {
        if (e instanceof PreconditionNotSatisfied) {
          socket.emit(ServerMessage.Error, e.message);
        } else {
          throw e;
        }
      }
      // io.in(room.id).emit(ServerMessage.StateUpdate, room.serializeForClient());
      logPlayer(player, `Continue To: ${room.state}`);
    });

    socket.on(ClientMessage.Reset, () => {
      if (!room.host && room.host.id === player.id) {
        socket.emit(ServerMessage.Error, ErrorMessage.HostOnly);
        return;
      }
      room.reset();
      io.in(room.id).emit(ServerMessage.StateUpdate, room.serializeForClient());
      logPlayer(player, `Reset`);
    });

    // Player Controls

    socket.on(ClientMessage.SetName, (name) => {
      if (typeof name !== 'string' || !name) {
        socket.emit(ServerMessage.Error, ErrorMessage.InvalidPlayerName);
        return;
      }
      if (room.playerWithName(name)) {
        socket.emit(ServerMessage.Error, ErrorMessage.PlayerNameTaken);
        return;
      }
      player.name = name;
      io.in(room.id).emit(ServerMessage.StateUpdate, room.serializeForClient());
      logPlayer(player, `SetName: ${name}`);
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
      io.in(room.id).emit(ServerMessage.StateUpdate, room.serializeForClient());
      logPlayer(player, `SetReady: ${isReady}`);
    });

    socket.on(ClientMessage.AddMessage, (message) => {
      if (room.state !== RoomState.Chat) {
        socket.emit(ServerMessage.Error, ErrorMessage.ChatOnly);
        return;
      }
      if (player.isSpectator) {
        socket.emit(ServerMessage.Error, ErrorMessage.SpectatorNotPermitted);
      }
      if (typeof message !== 'string' || !message) {
        socket.emit(ServerMessage.Error, ErrorMessage.EmptyMessage);
        return;
      }
      room.addMessage(player.id, message);
      io.in(room.id).emit(ServerMessage.StateUpdate, room.serializeForClient());
      logPlayer(player, `AddMessage: ${message}`);
    });

    socket.on(ClientMessage.SetVote, (anonName) => {
      if (room.state !== RoomState.Vote) {
        socket.emit(ServerMessage.Error, ErrorMessage.VoteOnly);
        return;
      }
      if (typeof anonName !== 'string' || !anonName) {
        socket.emit(ServerMessage.Error, ErrorMessage.InvalidPlayerName);
        return;
      }
      try {
        room.currentRound.setVote(player.id, anonName);
        io.in(room.id).emit(ServerMessage.StateUpdate, room.serializeForClient());
        logPlayer(player, `Vote: ${anonName}`);
      } catch (e) {
        socket.emit(ServerMessage.Error, e.message);
      }
    });
  });
};

function logPlayer(player, message) {
  console.info(`Player ${player.id}(${player.name}): ${message}`);
}

function logServer(message) {
  console.info(`Server: ${message}`);
}
