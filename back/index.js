const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketController = require('./controllers/socketController');

// Configuration de l'application Express
const app = express();
app.use(cors());

// Configuration du serveur HTTP
const server = http.createServer(app);

// Configuration de Socket.IO
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",  // React dev server
            "http://localhost:5173"   // Vite dev server
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Initialisation des websockets
socketController(io);

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
    console.error('❌ Erreur non gérée:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Exception non capturée:', error);
    process.exit(1);
});