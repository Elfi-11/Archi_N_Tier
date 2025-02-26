const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketController = require('./controllers/socketController');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"], // Autoriser les deux ports
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Initialiser le contrôleur socket
socketController(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});