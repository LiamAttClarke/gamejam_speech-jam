const path = require('path');
const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');

const PORT = process.env.PORT || 3000;

const CLIENT_DIST = path.join(__dirname, '../client/dist');

const app = express();
const httpServer = http.createServer(app);
const io = SocketIO(httpServer, {});

app.use(express.static(CLIENT_DIST));

app.get('*', (request, response) => {
    response.sendFile(path.join(CLIENT_DIST, 'index.html'));
});

io.on('connection', (socket) => {
    console.log(socket);
});

httpServer.listen(PORT, () => {
    console.log(`Serving on port ${PORT}.`);
});
