const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server, {
    cors: {
        origin: [
            "https://metervara-socket-io-client-test.netlify.app",
            "https://metervara-socket-io-client.netlify.app",
            "http://localhost:8080", // FOr local testing only, do not deploy with this
        ]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));

    socket.on('message', (val) => {
        console.log('Broadcast message', val)
        io.emit('message', val)
    });
});

/* Broadcast server time to clients */
setInterval(() => io.emit('time', new Date().toTimeString()), 1000);