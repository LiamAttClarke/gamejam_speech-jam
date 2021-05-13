const path = require('path');
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
const open = require('open');
const { onConnect } = require('./api')

const PORT = process.env.PORT || 3000;
const CLIENT_ADDRESS = `http://localhost:${PORT}`;

const CLIENT_DIST = path.join(__dirname, '../client/dist');

const app = express();
const httpServer = http.createServer(app);
const io = SocketIO(httpServer, {});

app.use(express.static(CLIENT_DIST));

app.get('*', (request, response) => {
  response.sendFile(path.join(CLIENT_DIST, 'index.html'));
});

io.on('connection', onConnect);

httpServer.listen(PORT, () => {
  console.info(`
  SpeechJam

  Compete with friends to blend in with the AI in a chatroom. Vote on the imposter, get points each round for guessing correctly and for tricking your opponents.

  Visit ${CLIENT_ADDRESS} to get started.
  `);
  if (process.env.NODE_ENV === 'production') {
    open(CLIENT_ADDRESS);
  }  
});
